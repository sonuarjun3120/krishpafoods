-- Create notifications table for WhatsApp, Email, SMS tracking
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL CHECK (type IN ('whatsapp', 'email', 'sms')),
  recipient VARCHAR NOT NULL CHECK (recipient IN ('customer', 'owner')),
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications table
CREATE POLICY "Admin can manage all notifications" 
ON public.notifications 
FOR ALL 
USING (true);

-- Update orders table to ensure all needed fields exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS order_number VARCHAR GENERATED ALWAYS AS ('KP' || LPAD(EXTRACT(epoch FROM created_at)::text, 10, '0')) STORED;

-- Create function to update notifications updated_at
CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications updated_at
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notifications_updated_at();

-- Enable real-time for orders and notifications tables
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;