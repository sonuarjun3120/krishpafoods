
-- Create admin_settings table to store real configuration data
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (only authenticated users can manage settings)
CREATE POLICY "Allow authenticated users to view settings" 
  ON public.admin_settings 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert settings" 
  ON public.admin_settings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update settings" 
  ON public.admin_settings 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Insert default admin settings
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
('site_settings', '{
  "siteName": "Spice Store",
  "siteDescription": "Premium spices and seasonings",
  "contactEmail": "contact@spicestore.com",
  "currency": "USD"
}'),
('payment_settings', '{
  "stripeEnabled": true,
  "paypalEnabled": false,
  "razorpayEnabled": true
}'),
('shipping_settings', '{
  "freeShippingThreshold": 50,
  "domesticShipping": 5.99,
  "internationalShipping": 15.99,
  "shippingZones": ["US", "Canada", "International"]
}'),
('tax_settings', '{
  "taxEnabled": true,
  "taxRate": 8.5,
  "taxIncluded": false
}'),
('notification_settings', '{
  "emailNotifications": true,
  "smsNotifications": false,
  "lowStockAlerts": true,
  "newOrderAlerts": true,
  "notificationEmail": "",
  "notificationPhone": ""
}');

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_settings_updated_at();
