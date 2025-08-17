-- Emergency fix for customer personal information exposure
-- The users table currently allows public read access to sensitive customer data

-- First, check and drop any policies that allow public read access
DROP POLICY IF EXISTS "Public users can view users" ON public.users;
DROP POLICY IF EXISTS "Anyone can view users" ON public.users;
DROP POLICY IF EXISTS "Public can view users" ON public.users;
DROP POLICY IF EXISTS "Users are publicly readable" ON public.users;

-- Ensure only authenticated users can view their own data
-- Replace the overly broad "Admin can manage all users" policy with more specific ones
DROP POLICY IF EXISTS "Admin can manage all users" ON public.users;

-- Create specific admin policies (requires proper authentication system)
CREATE POLICY "Authenticated admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (
  -- This will need proper role-based access control when auth is implemented
  -- For now, we'll restrict to service role only for admin operations
  false -- No authenticated user can view all users until proper admin roles are implemented
);

CREATE POLICY "Authenticated admins can update users"
ON public.users
FOR UPDATE
TO authenticated
USING (false) -- Disabled until proper admin authentication
WITH CHECK (false);

CREATE POLICY "Authenticated admins can delete users"
ON public.users
FOR DELETE
TO authenticated
USING (false); -- Disabled until proper admin authentication

-- Users can only view and update their own records when authenticated
CREATE POLICY "Users can view own record by email match"
ON public.users
FOR SELECT
TO authenticated
USING (
  email IS NOT NULL AND 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can view own record by phone match"
ON public.users
FOR SELECT
TO authenticated
USING (
  phone IS NOT NULL AND
  phone = (SELECT phone FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can update own record"
ON public.users
FOR UPDATE
TO authenticated
USING (
  (email IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid())) OR
  (phone IS NOT NULL AND phone = (SELECT phone FROM auth.users WHERE id = auth.uid()))
)
WITH CHECK (
  (email IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid())) OR
  (phone IS NOT NULL AND phone = (SELECT phone FROM auth.users WHERE id = auth.uid()))
);

-- Keep the existing insert policy for user registration
-- "Public users can create user records" policy remains for registration

-- Service role maintains full access for backend operations and admin functions
CREATE POLICY "Service role has full access"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);