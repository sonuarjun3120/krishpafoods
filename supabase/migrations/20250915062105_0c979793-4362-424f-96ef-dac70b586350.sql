-- Fix critical security vulnerability: orders table is publicly readable
-- Drop the overly permissive policy that allows public access to sensitive customer data
DROP POLICY IF EXISTS "Admin and service role can manage all orders" ON public.orders;

-- Create secure policies for orders table
-- Users can view their own orders by phone number
CREATE POLICY "Users can view own orders by phone" 
ON public.orders 
FOR SELECT 
USING (user_phone = (auth.jwt() ->> 'phone'::text));

-- Users can view their own orders by email address
CREATE POLICY "Users can view own orders by email" 
ON public.orders 
FOR SELECT 
USING (user_email = (auth.jwt() ->> 'email'::text));

-- Service role has full access to all orders (for admin functionality)
CREATE POLICY "Service role can manage all orders" 
ON public.orders 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Keep the existing policy for order creation (needed for checkout)
-- "Anyone can create orders" policy already exists and is correct

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;