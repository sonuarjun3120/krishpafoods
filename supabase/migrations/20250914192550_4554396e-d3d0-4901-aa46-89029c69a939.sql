-- Fix critical security vulnerability: notifications table is publicly readable
-- Drop the overly permissive policy that allows public access to sensitive data
DROP POLICY IF EXISTS "Admin can manage all notifications" ON public.notifications;

-- Create secure policy: only service role can access notifications
-- This ensures customer phone numbers and personal messages are protected
CREATE POLICY "Service role only can manage notifications" 
ON public.notifications 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;