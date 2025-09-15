-- Fix critical security vulnerability: OTP verification table access
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can manage own OTP" ON public.otp_verifications;

-- Create more restrictive policies for OTP verification
-- Users can only insert their own OTP records
CREATE POLICY "Users can create own OTP verification" 
ON public.otp_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only view their own non-expired OTP records
CREATE POLICY "Users can view own valid OTP" 
ON public.otp_verifications 
FOR SELECT 
USING (
  auth.uid() = user_id 
  AND expires_at > now()
  AND verified = false
);

-- Users can only update their own OTP records to mark as verified
CREATE POLICY "Users can verify own OTP" 
ON public.otp_verifications 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND verified = true);

-- Service role has full access for cleanup and admin operations
CREATE POLICY "Service role can manage all OTP verifications" 
ON public.otp_verifications 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to automatically clean up expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_verifications 
  WHERE expires_at < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Verify RLS is enabled
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;