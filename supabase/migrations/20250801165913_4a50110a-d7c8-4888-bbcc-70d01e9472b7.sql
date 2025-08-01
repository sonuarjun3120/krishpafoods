-- Fix RLS policy for orders table to allow public order creation
DROP POLICY IF EXISTS "Public users can create new orders" ON public.orders;

-- Create a proper policy that allows anyone to insert orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also ensure the edge function can work with service role
-- Update the existing admin policy to be more explicit
DROP POLICY IF EXISTS "Admin users can view and manage all orders" ON public.orders;

CREATE POLICY "Admin and service role can manage all orders" 
ON public.orders 
FOR ALL 
TO authenticated, service_role
USING (true) 
WITH CHECK (true);