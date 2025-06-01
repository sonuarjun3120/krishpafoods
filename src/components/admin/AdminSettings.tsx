
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, CreditCard, Truck, Globe, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Site Settings
    siteName: 'Spice Store',
    siteDescription: 'Premium spices and seasonings',
    contactEmail: 'contact@spicestore.com',
    currency: 'USD',
    
    // Payment Settings
    stripeEnabled: true,
    paypalEnabled: false,
    razorpayEnabled: true,
    
    // Shipping Settings
    freeShippingThreshold: 50,
    domesticShipping: 5.99,
    internationalShipping: 15.99,
    shippingZones: ['US', 'Canada', 'International'],
    
    // Tax Settings
    taxEnabled: true,
    taxRate: 8.5,
    taxIncluded: false,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    newOrderAlerts: true,
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "All settings have been updated successfully",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
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
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting('contactEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
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
                checked={settings.stripeEnabled}
                onCheckedChange={(checked) => updateSetting('stripeEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="paypal">PayPal</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept PayPal payments</p>
              </div>
              <Switch
                id="paypal"
                checked={settings.paypalEnabled}
                onCheckedChange={(checked) => updateSetting('paypalEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="razorpay">Razorpay</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept Indian payments via Razorpay</p>
              </div>
              <Switch
                id="razorpay"
                checked={settings.razorpayEnabled}
                onCheckedChange={(checked) => updateSetting('razorpayEnabled', checked)}
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
                value={settings.freeShippingThreshold}
                onChange={(e) => updateSetting('freeShippingThreshold', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domesticShipping">Domestic Shipping Rate ($)</Label>
              <Input
                id="domesticShipping"
                type="number"
                step="0.01"
                value={settings.domesticShipping}
                onChange={(e) => updateSetting('domesticShipping', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internationalShipping">International Shipping Rate ($)</Label>
              <Input
                id="internationalShipping"
                type="number"
                step="0.01"
                value={settings.internationalShipping}
                onChange={(e) => updateSetting('internationalShipping', parseFloat(e.target.value))}
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
                checked={settings.taxEnabled}
                onCheckedChange={(checked) => updateSetting('taxEnabled', checked)}
              />
            </div>
            {settings.taxEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="taxIncluded">Tax Included in Prices</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Prices include tax</p>
                  </div>
                  <Switch
                    id="taxIncluded"
                    checked={settings.taxIncluded}
                    onCheckedChange={(checked) => updateSetting('taxIncluded', checked)}
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
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive SMS alerts</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alert when stock is low</p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={settings.lowStockAlerts}
                    onCheckedChange={(checked) => updateSetting('lowStockAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newOrderAlerts">New Order Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alert for new orders</p>
                  </div>
                  <Switch
                    id="newOrderAlerts"
                    checked={settings.newOrderAlerts}
                    onCheckedChange={(checked) => updateSetting('newOrderAlerts', checked)}
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
