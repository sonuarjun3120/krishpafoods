
import { supabase } from '@/integrations/supabase/client';

export interface AdminSettingsData {
  site_settings: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    currency: string;
  };
  payment_settings: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    razorpayEnabled: boolean;
  };
  shipping_settings: {
    freeShippingThreshold: number;
    domesticShipping: number;
    internationalShipping: number;
    shippingZones: string[];
  };
  tax_settings: {
    taxEnabled: boolean;
    taxRate: number;
    taxIncluded: boolean;
  };
  notification_settings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    lowStockAlerts: boolean;
    newOrderAlerts: boolean;
    notificationEmail: string;
    notificationPhone: string;
  };
}

export const adminSettingsService = {
  async getSettings(): Promise<AdminSettingsData | null> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value');

      if (error) {
        console.error('Error fetching admin settings:', error);
        return null;
      }

      const settings: any = {};
      data?.forEach(item => {
        settings[item.setting_key] = item.setting_value;
      });

      // Return settings with proper structure, or null if no data
      return data && data.length > 0 ? settings as AdminSettingsData : null;
    } catch (error) {
      console.error('Error in getSettings:', error);
      return null;
    }
  },

  async updateSetting(settingKey: string, settingValue: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          setting_key: settingKey,
          setting_value: settingValue 
        });

      if (error) {
        console.error('Error updating admin setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSetting:', error);
      return false;
    }
  }
};
