
-- Enable RLS on categories table if not already enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read categories (public data)
CREATE POLICY "Anyone can view categories" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert categories (for admin functionality)
CREATE POLICY "Anyone can create categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to update categories (for admin functionality)
CREATE POLICY "Anyone can update categories" 
  ON public.categories 
  FOR UPDATE 
  USING (true);

-- Create policy to allow anyone to delete categories (for admin functionality)
CREATE POLICY "Anyone can delete categories" 
  ON public.categories 
  FOR DELETE 
  USING (true);
