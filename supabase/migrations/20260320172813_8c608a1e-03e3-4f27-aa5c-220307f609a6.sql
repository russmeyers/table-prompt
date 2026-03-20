
-- Allow anonymous users to read restaurant name and incentive by public signup token
CREATE POLICY "Public can read restaurant by signup token" ON public.restaurants
  FOR SELECT TO anon
  USING (public_signup_token IS NOT NULL);
