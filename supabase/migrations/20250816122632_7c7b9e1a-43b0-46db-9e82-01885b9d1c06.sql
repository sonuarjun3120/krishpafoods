-- Fix critical security vulnerability in users table
-- Customer personal information (names, emails, phones) is currently publicly accessible

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Public users can view all users" ON public.users;
DROP POLICY IF EXISTS "Anyone can view users" ON public.users;

-- Create secure policies for user data access
-- Users can only view their own data (when authenticated via email or phone)
CREATE POLICY "Users can view own data by email"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' = email
);

CREATE POLICY "Users can view own data by phone"
ON public.users
FOR SELECT
TO authenticated  
USING (
  auth.jwt() ->> 'phone' = phone
);

-- Users can update their own data
CREATE POLICY "Users can update own data by email"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = email)
WITH CHECK (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own data by phone"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'phone' = phone)
WITH CHECK (auth.jwt() ->> 'phone' = phone);

-- Keep existing admin management policy (admins can manage all users)
-- Keep existing public insert policy (for user registration)

-- Service role maintains full access for backend operations
CREATE POLICY "Service role can manage all users"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);