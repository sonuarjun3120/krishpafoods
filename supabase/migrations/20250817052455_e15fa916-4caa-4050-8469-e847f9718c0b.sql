-- Fix critical security vulnerability in admin_settings table
-- Admin configuration data is currently accessible to any authenticated user
-- This could expose sensitive system configuration to attackers

-- Drop overly permissive policies that allow any authenticated user access
DROP POLICY IF EXISTS "Allow authenticated users to view settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete settings" ON public.admin_settings;

-- Create restrictive policies for admin settings access
-- Only service role and proper admin users should access these sensitive configurations

-- Temporarily disable authenticated user access until proper admin role system is implemented
CREATE POLICY "Only authenticated admins can view settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (
  -- Disable until proper admin authentication is implemented
  -- This prevents any authenticated user from accessing sensitive admin config
  false
);

CREATE POLICY "Only authenticated admins can insert settings"
ON public.admin_settings
FOR INSERT
TO authenticated
WITH CHECK (
  -- Disable until proper admin authentication is implemented
  false
);

CREATE POLICY "Only authenticated admins can update settings"
ON public.admin_settings
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Only authenticated admins can delete settings"
ON public.admin_settings
FOR DELETE
TO authenticated
USING (false);

-- Service role maintains full access for backend operations and admin functionality
CREATE POLICY "Service role can manage all admin settings"
ON public.admin_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Note: When proper authentication is implemented, the admin policies above should be updated to:
-- USING (has_admin_role(auth.uid()) = true) or similar role-based check