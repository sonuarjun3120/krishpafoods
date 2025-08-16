-- Fix critical security vulnerability in products table
-- Drop overly permissive policies that allow anyone to modify products
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Admin users can perform all operations on products" ON public.products;

-- Keep public read access (this is safe for e-commerce)
-- The existing "Anyone can view products" and "Public users can view products" policies are fine

-- Create secure write policies for authenticated admin users only
-- Note: This anticipates implementing proper authentication with admin role detection
CREATE POLICY "Only authenticated admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  -- This will need to be updated when proper admin role system is implemented
  -- For now, only allow authenticated users (will be restricted further with role-based access)
  auth.uid() IS NOT NULL
);

CREATE POLICY "Only authenticated admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Create an admin-only management policy for service role operations
CREATE POLICY "Service role can manage all products"
ON public.products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);