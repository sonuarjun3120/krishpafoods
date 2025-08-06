-- Add missing Razorpay columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_order_id text;