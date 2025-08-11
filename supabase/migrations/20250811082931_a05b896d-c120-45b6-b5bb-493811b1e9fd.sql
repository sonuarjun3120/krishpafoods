-- Create function and trigger to enqueue notifications when payment_status becomes 'completed'
-- and was previously not 'completed'

-- Ensure required extension for JSON operations is available (usually default)
-- Optionally enable http extension if later needed (kept commented for now)
-- CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- 1) Create or replace helper function to format address and items into text
CREATE OR REPLACE FUNCTION public.format_order_summary(order_row public.orders)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  addr jsonb;
  items_arr jsonb;
  addr_text text;
  items_text text;
BEGIN
  addr := order_row.shipping_address;
  items_arr := order_row.items;

  addr_text := trim(both ' ' from (
    coalesce(addr->>'streetAddress', addr->>'address') || ', ' ||
    coalesce(addr->>'city', '') || ', ' ||
    coalesce(addr->>'state', '') || ' - ' ||
    coalesce(addr->>'pincode', addr->>'zipCode', '')
  ));

  -- Build items list, expecting items as JSON array of objects with name, weight, quantity, price
  items_text := (
    SELECT string_agg(
      format('%sx %s%s%s - ₹%s',
        coalesce((item->>'quantity')::text, '1'),
        coalesce(item->>'name', 'Item'),
        CASE WHEN coalesce(item->>'weight','') <> '' THEN ' (' || (item->>'weight') || ')' ELSE '' END,
        '',
        coalesce(item->>'price','0')
      ), E'\n'
    )
    FROM jsonb_array_elements(items_arr) AS item
  );

  RETURN format(
    'Order #%s\nCustomer: %s\nPhone: %s\nEmail: %s\nAmount: ₹%s\nPayment Method: %s\n\nShip to:\n%s\n\nItems:\n%s',
    coalesce(order_row.order_number, left(order_row.id::text, 8)),
    coalesce(order_row.user_name, 'N/A'),
    coalesce(order_row.user_phone, 'N/A'),
    coalesce(order_row.user_email, 'N/A'),
    order_row.total_amount::text,
    coalesce(order_row.payment_method, 'upi'),
    coalesce(addr_text, 'N/A'),
    coalesce(items_text, 'N/A')
  );
END;
$$;

-- 2) Create trigger function to insert notifications upon payment completion
CREATE OR REPLACE FUNCTION public.enqueue_notifications_on_payment_complete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  summary text;
BEGIN
  -- Only act when payment_status transitions to 'completed'
  IF NEW.payment_status = 'completed' AND coalesce(OLD.payment_status,'') <> 'completed' THEN
    summary := public.format_order_summary(NEW);

    -- Email to store owner
    INSERT INTO public.notifications (order_id, type, recipient, status, message)
    VALUES (NEW.id, 'email', 'krishpafoods@gmail.com', 'pending', summary);

    -- SMS to store owner
    INSERT INTO public.notifications (order_id, type, recipient, status, message)
    VALUES (NEW.id, 'sms', '9347445411', 'pending', summary);

    -- WhatsApp to store owner
    INSERT INTO public.notifications (order_id, type, recipient, status, message)
    VALUES (NEW.id, 'whatsapp', '9347445411', 'pending', summary);
  END IF;
  RETURN NEW;
END;
$$;

-- 3) Create trigger on orders table
DROP TRIGGER IF EXISTS trg_enqueue_notifications_on_payment_complete ON public.orders;
CREATE TRIGGER trg_enqueue_notifications_on_payment_complete
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.enqueue_notifications_on_payment_complete();