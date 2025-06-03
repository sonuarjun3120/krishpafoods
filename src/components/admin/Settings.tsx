
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { supabaseContentService } from '@/services/supabaseContentService';
import { User } from '@supabase/supabase-js';

export const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setNewEmail(user.email || '');
        
        // Load or create profile
        let userProfile = await supabaseContentService.getProfile(user.id);
        if (!userProfile) {
          userProfile = await supabaseContentService.createProfile({
            user_id: user.id,
            email: user.email || '',
            full_name: ''
          });
        }
        setProfile(userProfile);
        setFullName(userProfile?.full_name || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPEmail = async () => {
    if (!user || !newEmail) return;

    try {
      const otp = generateOTP();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

      await supabaseContentService.createOTPVerification({
        user_id: user.id,
        email: newEmail,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false
      });

      // In a real app, you'd send this via email service
      // For demo purposes, we'll show it in console and toast
      console.log('OTP Code:', otp);
      
      toast({
        title: "OTP Sent",
        description: `OTP code sent to ${newEmail}. Check console for demo purposes: ${otp}`,
      });
      
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const verifyOTPAndUpdate = async () => {
    if (!user || !otpCode) return;

    try {
      const isValid = await supabaseContentService.verifyOTP(user.id, otpCode);
      
      if (!isValid) {
        toast({
          title: "Invalid OTP",
          description: "Please check your OTP code and try again.",
          variant: "destructive",
        });
        return;
      }

      // Update email if changed
      if (newEmail !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: newEmail
        });
        
        if (emailError) throw emailError;
      }

      // Update password if provided
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (passwordError) throw passwordError;
      }

      // Update profile
      await supabaseContentService.updateProfile(user.id, {
        email: newEmail,
        full_name: fullName
      });

      toast({
        title: "Settings Updated",
        description: "Your account settings have been updated successfully.",
      });

      setOtpSent(false);
      setOtpCode('');
      setNewPassword('');
      loadUserData();

    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      await supabaseContentService.updateProfile(user.id, {
        full_name: fullName
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <Button onClick={updateProfile} className="w-full">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            {!otpSent ? (
              <Button 
                onClick={sendOTPEmail} 
                className="w-full"
                disabled={!newEmail || newEmail === user?.email && !newPassword}
              >
                Send OTP to Update
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP Code</Label>
                  <Input
                    id="otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={verifyOTPAndUpdate} className="flex-1">
                    Verify & Update
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
