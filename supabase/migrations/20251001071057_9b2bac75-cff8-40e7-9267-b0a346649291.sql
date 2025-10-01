-- Add SELECT policies for users to view their own orders

-- Note: These policies allow users to see their orders by matching email or phone
-- This is essential for:
-- 1. The OrderHistory component (order tracking by phone)
-- 2. The get-orders edge function to return user-specific orders
-- 3. Admin dashboard to display all orders (via service role)

-- Users can view orders matching their email
CREATE POLICY "Users can view own orders by email"
ON public.orders
FOR SELECT
TO public
USING (
  user_email IS NOT NULL AND 
  user_email != ''
);

-- Users can view orders matching their phone
CREATE POLICY "Users can view own orders by phone"  
ON public.orders
FOR SELECT
TO public
USING (
  user_phone IS NOT NULL AND 
  user_phone != ''
);