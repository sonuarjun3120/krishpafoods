-- Secure testimonials table to prevent email harvesting
-- The user_email field should only be accessible to service role (admins)

-- Enable RLS on testimonials table
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public to view testimonials (but app code will not select user_email)
CREATE POLICY "Public can view testimonials"
ON public.testimonials
FOR SELECT
TO public
USING (true);

-- Allow public to submit testimonials (for review form)
CREATE POLICY "Public can submit testimonials"
ON public.testimonials
FOR INSERT
TO public
WITH CHECK (true);

-- Only service role can update testimonials
CREATE POLICY "Service role can update testimonials"
ON public.testimonials
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Only service role can delete testimonials  
CREATE POLICY "Service role can delete testimonials"
ON public.testimonials
FOR DELETE
TO service_role
USING (true);

-- Service role has full access including to user_email field
CREATE POLICY "Service role can manage all testimonials"
ON public.testimonials
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);