
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, CreditCard, Truck, Globe, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminSettingsService, AdminSettings } from '@/services/adminSettingsService';

export const AdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminSettingsService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const updates = [
        adminSettingsService.updateSetting('site_settings', settings.site_settings),
        adminSettingsService.updateSetting('payment_settings', settings.payment_settings),
        adminSettingsService.updateSetting('shipping_settings', settings.shipping_settings),
        adminSettingsService.updateSetting('tax_settings', settings.tax_settings),
        adminSettingsService.updateSetting('notification_settings', settings.notification_settings),
      ];

      const results = await Promise.all(updates);
      const allSuccessful = results.every(result => result === true);

      if (allSuccessful) {
        toast({
          title: "Settings Saved",
          description: "All settings have been updated successfully",
        });
      } else {
        toast({
          title: "Partial Success",
          description: "Some settings may not have been saved properly",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category: keyof AdminSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p>Failed to load settings. Please try again.</p>
        <Button onClick={loadSettings} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Site Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.site_settings.siteName}
                onChange={(e) => updateSetting('site_settings', 'siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.site_settings.siteDescription}
                onChange={(e) => updateSetting('site_settings', 'siteDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.site_settings.contactEmail}
                onChange={(e) => updateSetting('site_settings', 'contactEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select 
                value={settings.site_settings.currency} 
                onValueChange={(value) => updateSetting('site_settings', 'currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Gateways
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="stripe">Stripe</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept credit cards via Stripe</p>
              </div>
              <Switch
                id="stripe"
                checked={settings.payment_settings.stripeEnabled}
                onCheckedChange={(checked) => updateSetting('payment_settings', 'stripeEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="paypal">PayPal</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept PayPal payments</p>
              </div>
              <Switch
                id="paypal"
                checked={settings.payment_settings.paypalEnabled}
                onCheckedChange={(checked) => updateSetting('payment_settings', 'paypalEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="razorpay">Razorpay</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept Indian payments via Razorpay</p>
              </div>
              <Switch
                id="razorpay"
                checked={settings.payment_settings.razorpayEnabled}
                onCheckedChange={(checked) => updateSetting('payment_settings', 'razorpayEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Shipping Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="freeShipping">Free Shipping Threshold ($)</Label>
              <Input
                id="freeShipping"
                type="number"
                value={settings.shipping_settings.freeShippingThreshold}
                onChange={(e) => updateSetting('shipping_settings', 'freeShippingThreshold', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domesticShipping">Domestic Shipping Rate ($)</Label>
              <Input
                id="domesticShipping"
                type="number"
                step="0.01"
                value={settings.shipping_settings.domesticShipping}
                onChange={(e) => updateSetting('shipping_settings', 'domesticShipping', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internationalShipping">International Shipping Rate ($)</Label>
              <Input
                id="internationalShipping"
                type="number"
                step="0.01"
                value={settings.shipping_settings.internationalShipping}
                onChange={(e) => updateSetting('shipping_settings', 'internationalShipping', parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="taxEnabled">Enable Tax Calculation</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Apply taxes to orders</p>
              </div>
              <Switch
                id="taxEnabled"
                checked={settings.tax_settings.taxEnabled}
                onCheckedChange={(checked) => updateSetting('tax_settings', 'taxEnabled', checked)}
              />
            </div>
            {settings.tax_settings.taxEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.tax_settings.taxRate}
                    onChange={(e) => updateSetting('tax_settings', 'taxRate', parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="taxIncluded">Tax Included in Prices</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Prices include tax</p>
                  </div>
                  <Switch
                    id="taxIncluded"
                    checked={settings.tax_settings.taxIncluded}
                    onCheckedChange={(checked) => updateSetting('tax_settings', 'taxIncluded', checked)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive email alerts</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notification_settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notification_settings', 'emailNotifications', checked)}
                  />
                </div>
                
                {settings.notification_settings.emailNotifications && (
                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail">Notification Email</Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={settings.notification_settings.notificationEmail}
                      onChange={(e) => updateSetting('notification_settings', 'notificationEmail', e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive SMS alerts</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.notification_settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('notification_settings', 'smsNotifications', checked)}
                  />
                </div>

                {settings.notification_settings.smsNotifications && (
                  <div className="space-y-2">
                    <Label htmlFor="notificationPhone">Notification Phone</Label>
                    <Input
                      id="notificationPhone"
                      type="tel"
                      placeholder="+1234567890"
                      value={settings.notification_settings.notificationPhone}
                      onChange={(e) => updateSetting('notification_settings', 'notificationPhone', e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alert when stock is low</p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={settings.notification_settings.lowStockAlerts}
                    onCheckedChange={(checked) => updateSetting('notification_settings', 'lowStockAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newOrderAlerts">New Order Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alert for new orders</p>
                  </div>
                  <Switch
                    id="newOrderAlerts"
                    checked={settings.notification_settings.newOrderAlerts}
                    onCheckedChange={(checked) => updateSetting('notification_settings', 'newOrderAlerts', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
