-- Enhance orders table with delivery tracking
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS courier_name TEXT,
ADD COLUMN IF NOT EXISTS tracking_id TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS actual_delivery_date TIMESTAMP WITH TIME ZONE;

-- Add average order value to user_analytics
ALTER TABLE public.user_analytics
ADD COLUMN IF NOT EXISTS average_order_value NUMERIC DEFAULT 0;

-- Update the user analytics trigger to calculate average order value
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_email IS NOT NULL AND NEW.user_email != '' THEN
    INSERT INTO public.user_analytics (
      user_email, 
      user_name, 
      user_phone, 
      total_orders, 
      total_spent,
      average_order_value,
      last_order_date
    )
    VALUES (
      NEW.user_email,
      NEW.user_name,
      NEW.user_phone,
      1,
      NEW.total_amount,
      NEW.total_amount,
      NEW.created_at
    )
    ON CONFLICT (user_email) DO UPDATE SET
      total_orders = user_analytics.total_orders + 1,
      total_spent = user_analytics.total_spent + NEW.total_amount,
      average_order_value = (user_analytics.total_spent + NEW.total_amount) / (user_analytics.total_orders + 1),
      last_order_date = NEW.created_at,
      user_name = COALESCE(NEW.user_name, user_analytics.user_name),
      user_phone = COALESCE(NEW.user_phone, user_analytics.user_phone),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;