-- Fix critical security vulnerability in user_analytics table
-- Drop the overly permissive policy that allows public access to sensitive customer data
DROP POLICY IF EXISTS "Admin can manage user analytics" ON public.user_analytics;

-- Create secure policies for user_analytics table
-- Only service role can manage all user analytics (for automated triggers and admin functions)
CREATE POLICY "Service role can manage all user analytics"
ON public.user_analytics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Only service role can view user analytics (admin access only)
CREATE POLICY "Only service role can view user analytics"
ON public.user_analytics
FOR SELECT
TO service_role
USING (true);

-- Only service role can insert user analytics (for automated order processing)
CREATE POLICY "Only service role can insert user analytics"
ON public.user_analytics
FOR INSERT
TO service_role
WITH CHECK (true);

-- Only service role can update user analytics (for automated order processing)
CREATE POLICY "Only service role can update user analytics"
ON public.user_analytics
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);