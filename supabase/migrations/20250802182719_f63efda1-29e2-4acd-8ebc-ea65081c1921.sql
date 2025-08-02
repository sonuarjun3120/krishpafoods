-- Fix the user analytics trigger to handle null/empty emails
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only update analytics if user_email is provided and not empty
  IF NEW.user_email IS NOT NULL AND NEW.user_email != '' THEN
    -- Insert or update user analytics
    INSERT INTO public.user_analytics (user_email, user_name, user_phone, total_orders, total_spent, last_order_date)
    VALUES (
      NEW.user_email,
      NEW.user_name,
      NEW.user_phone,
      1,
      NEW.total_amount,
      NEW.created_at
    )
    ON CONFLICT (user_email) DO UPDATE SET
      total_orders = user_analytics.total_orders + 1,
      total_spent = user_analytics.total_spent + NEW.total_amount,
      last_order_date = NEW.created_at,
      user_name = COALESCE(NEW.user_name, user_analytics.user_name),
      user_phone = COALESCE(NEW.user_phone, user_analytics.user_phone),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$function$