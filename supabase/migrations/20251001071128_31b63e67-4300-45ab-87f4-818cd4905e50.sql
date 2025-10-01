-- CRITICAL FIX: Remove overly permissive SELECT policies
-- Those policies allowed anyone to see ALL orders, which is a major security breach

DROP POLICY IF EXISTS "Users can view own orders by email" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders by phone" ON public.orders;

-- The correct security model for this app:
-- 1. Anyone can create orders (guest checkout) ✓
-- 2. Service role can manage all orders (for admin dashboard and get-orders function) ✓  
-- 3. Users track orders via the get-orders edge function, which:
--    - Uses service role to bypass RLS
--    - Validates the phone number provided
--    - Returns only orders matching that phone
--
-- This is more secure than RLS policies because the edge function
-- can implement rate limiting and additional validation logic