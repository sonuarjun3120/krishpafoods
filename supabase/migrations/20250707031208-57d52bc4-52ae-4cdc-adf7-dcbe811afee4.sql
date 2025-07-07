-- Fix RLS policies for categories to allow proper deletion
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;

-- Create new policies that work properly
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can manage categories" 
ON public.categories 
FOR ALL 
USING (true) 
WITH CHECK (true);