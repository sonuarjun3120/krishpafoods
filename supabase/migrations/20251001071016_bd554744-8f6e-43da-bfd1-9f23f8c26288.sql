-- Ensure RLS is enabled on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on orders table
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders by email" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders by phone" ON public.orders;
DROP POLICY IF EXISTS "Service role can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Allow anyone to create orders (for guest checkout)
CREATE POLICY "Allow order creation"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- Service role has full access for admin operations
CREATE POLICY "Service role can manage all orders"
ON public.orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);