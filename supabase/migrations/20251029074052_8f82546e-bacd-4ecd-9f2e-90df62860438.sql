-- Create user roles system for proper admin authentication

-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Update admin-protected tables to use role-based access
DROP POLICY IF EXISTS "Only authenticated admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Only authenticated admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Only authenticated admins can update products" ON public.products;

CREATE POLICY "Only admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update admin_settings policies
DROP POLICY IF EXISTS "Only authenticated admins can delete settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Only authenticated admins can insert settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Only authenticated admins can update settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Only authenticated admins can view settings" ON public.admin_settings;

CREATE POLICY "Only admins can view settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert settings"
ON public.admin_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update settings"
ON public.admin_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete settings"
ON public.admin_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update users table policies for admin access
DROP POLICY IF EXISTS "Authenticated admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Authenticated admins can update users" ON public.users;
DROP POLICY IF EXISTS "Authenticated admins can view all users" ON public.users;

CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update users"
ON public.users
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete users"
ON public.users
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));