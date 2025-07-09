
-- Insert default admin settings data
INSERT INTO admin_settings (setting_key, setting_value) VALUES
('site_settings', '{
  "siteName": "Krishnaveni Pickles",
  "siteDescription": "Authentic Telugu pickles and traditional preserves",
  "contactEmail": "admin@krishnavenicurries.com",
  "currency": "INR"
}'),
('payment_settings', '{
  "stripeEnabled": false,
  "paypalEnabled": false,
  "razorpayEnabled": true
}'),
('shipping_settings', '{
  "freeShippingThreshold": 500,
  "domesticShipping": 50,
  "internationalShipping": 200,
  "shippingZones": ["India", "USA", "UK"]
}'),
('tax_settings', '{
  "taxEnabled": true,
  "taxRate": 18,
  "taxIncluded": false
}'),
('notification_settings', '{
  "emailNotifications": true,
  "smsNotifications": false,
  "lowStockAlerts": true,
  "newOrderAlerts": true,
  "notificationEmail": "admin@krishnavenicurries.com",
  "notificationPhone": ""
}')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value;

-- Create media table for Media Manager
CREATE TABLE IF NOT EXISTS public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  category TEXT DEFAULT 'general',
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Create policies for media access
CREATE POLICY "Admin can manage all media" 
ON public.media 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates on media
CREATE TRIGGER update_media_updated_at
BEFORE UPDATE ON public.media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create pages table for Page Content Editor
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies for pages access
CREATE POLICY "Admin can manage all pages" 
ON public.pages 
FOR ALL 
USING (true);

CREATE POLICY "Public can view published pages" 
ON public.pages 
FOR SELECT 
USING (status = 'published');

-- Create trigger for automatic timestamp updates on pages
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pages
INSERT INTO public.pages (slug, title, content_blocks) VALUES
('home', 'Home Page', '[
  {
    "type": "hero",
    "title": "Authentic Telugu Pickles & Preserves",
    "subtitle": "Made with traditional recipes passed down through generations",
    "image": "",
    "button": {
      "text": "Shop Now",
      "link": "/shop"
    }
  },
  {
    "type": "about",
    "title": "About Krishnaveni Pickles",
    "content": "We are dedicated to bringing you the most authentic and delicious Telugu pickles, made with the finest ingredients and traditional methods.",
    "image": ""
  }
]'),
('about', 'About Us', '[
  {
    "type": "content",
    "title": "Our Story",
    "content": "Krishnaveni Pickles was founded with a mission to preserve traditional Telugu cuisine and share it with the world. Our recipes have been passed down through generations.",
    "image": ""
  }
]'),
('contact', 'Contact Us', '[
  {
    "type": "contact",
    "title": "Get in Touch",
    "content": "We would love to hear from you. Contact us for any queries about our products or custom orders.",
    "email": "info@krishnavenicurries.com",
    "phone": "+91 9876543210"
  }
]')
ON CONFLICT (slug) DO UPDATE SET
  content_blocks = EXCLUDED.content_blocks,
  updated_at = now();
