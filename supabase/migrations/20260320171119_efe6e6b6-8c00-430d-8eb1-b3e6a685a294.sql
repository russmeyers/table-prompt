
-- Replace the overly permissive anon insert policy with a more restrictive one
DROP POLICY "Public can join via signup" ON public.contacts;

CREATE POLICY "Public can join via signup" ON public.contacts FOR INSERT TO anon
  WITH CHECK (
    opted_in = true
    AND opted_out = false
    AND source = 'public_signup'
    AND first_name IS NOT NULL
    AND mobile_number IS NOT NULL
    AND restaurant_id IS NOT NULL
  );
