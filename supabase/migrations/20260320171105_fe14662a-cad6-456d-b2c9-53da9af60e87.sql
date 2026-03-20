
-- Contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  mobile_number TEXT NOT NULL,
  email TEXT,
  opted_in BOOLEAN NOT NULL DEFAULT true,
  opted_out BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'manual',
  consent_source TEXT DEFAULT 'signup_form',
  opted_in_at TIMESTAMPTZ DEFAULT now(),
  opted_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaign suggestions table
CREATE TABLE public.campaign_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  trigger_type TEXT NOT NULL DEFAULT 'manual',
  suggestion_reason TEXT,
  recommended_message TEXT,
  recommended_send_time TIMESTAMPTZ,
  target_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  workflow JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES public.campaign_suggestions(id),
  title TEXT NOT NULL,
  message_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  target_count INTEGER DEFAULT 0,
  estimated_cost NUMERIC(10,2) DEFAULT 0,
  redemption_code TEXT,
  estimated_redemptions INTEGER,
  estimated_revenue NUMERIC(10,2),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaign sends table
CREATE TABLE public.campaign_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  provider TEXT DEFAULT 'textbelt',
  provider_cost NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notification logs table
CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES public.campaign_suggestions(id),
  notification_type TEXT NOT NULL DEFAULT 'sms',
  destination TEXT NOT NULL,
  message_body TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Offer templates table
CREATE TABLE public.offer_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  example_message TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Calendar events table
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  description TEXT,
  suggested_campaign_id UUID REFERENCES public.campaign_suggestions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Contacts policies (owner sees own restaurant's contacts)
CREATE POLICY "Owners can view own contacts" ON public.contacts FOR SELECT TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Owners can insert own contacts" ON public.contacts FOR INSERT TO authenticated
  WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Owners can update own contacts" ON public.contacts FOR UPDATE TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Owners can delete own contacts" ON public.contacts FOR DELETE TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Admins can manage all contacts" ON public.contacts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Campaign suggestions policies
CREATE POLICY "Owners can view own suggestions" ON public.campaign_suggestions FOR SELECT TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Owners can update own suggestions" ON public.campaign_suggestions FOR UPDATE TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Admins can manage all suggestions" ON public.campaign_suggestions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Campaigns policies
CREATE POLICY "Owners can view own campaigns" ON public.campaigns FOR SELECT TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Owners can insert own campaigns" ON public.campaigns FOR INSERT TO authenticated
  WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Owners can update own campaigns" ON public.campaigns FOR UPDATE TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Admins can manage all campaigns" ON public.campaigns FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Campaign sends policies
CREATE POLICY "Owners can view own sends" ON public.campaign_sends FOR SELECT TO authenticated
  USING (campaign_id IN (SELECT id FROM public.campaigns WHERE restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid())));
CREATE POLICY "Admins can manage all sends" ON public.campaign_sends FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Notification logs policies
CREATE POLICY "Owners can view own notifications" ON public.notification_logs FOR SELECT TO authenticated
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_user_id = auth.uid()));
CREATE POLICY "Admins can manage all notifications" ON public.notification_logs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Offer templates are readable by all authenticated users
CREATE POLICY "Anyone can view offer templates" ON public.offer_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage offer templates" ON public.offer_templates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Calendar events are readable by all authenticated users
CREATE POLICY "Anyone can view calendar events" ON public.calendar_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage calendar events" ON public.calendar_events FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Seed offer templates
INSERT INTO public.offer_templates (title, description, example_message, category) VALUES
  ('Free Appetizer', 'Free appetizer with any entrée purchase', 'Stop in tonight! Enjoy a FREE appetizer with any entrée. Show this text to redeem. See you soon!', 'food'),
  ('$5 Off $25', 'Save $5 on orders of $25 or more', 'Hey! Get $5 OFF when you spend $25+ today. Show this text to your server. Valid today only!', 'discount'),
  ('Free Dessert', 'Complimentary dessert tonight only', 'Sweet deal tonight 🍰 Enjoy a FREE dessert with your meal. Just show this text. See you soon!', 'food'),
  ('Kids Eat Free', 'One free kids meal per adult entrée', 'Kids eat FREE tonight with any adult entrée! Bring the family in — show this text to redeem.', 'family'),
  ('BOGO Deal', 'Buy one entrée, get one 50% off', 'Bring a friend! Buy one entrée, get one HALF OFF tonight. Show this text to your server.', 'discount'),
  ('Lunch Combo', 'Lunch combo special — entrée + drink', 'Lunch special today! Get an entrée + drink combo for just $12. Show this text. Available 11am–2pm.', 'lunch'),
  ('Happy Hour', 'Extended happy hour specials', 'Happy Hour just got happier! Extended specials tonight 4–7pm. Show this text for a bonus app. Cheers!', 'drinks'),
  ('Rainy Day Special', 'Comfort food promo for bad weather', 'Rainy outside? Cozy up with us 🍲 Show this text for a FREE soup with any entrée tonight!', 'weather');

-- Seed calendar events
INSERT INTO public.calendar_events (name, event_date, description) VALUES
  ('Super Bowl', '2027-02-07', 'Big game day — wings, apps, watch party promos'),
  ('Valentine''s Day', '2027-02-14', 'Date night specials and prix fixe menus'),
  ('St. Patrick''s Day', '2027-03-17', 'Green-themed specials and drink promos'),
  ('March Madness', '2027-03-18', 'Tournament watch party and bar specials'),
  ('Cinco de Mayo', '2027-05-05', 'Mexican food and drink specials'),
  ('Mother''s Day', '2027-05-09', 'Brunch and dinner specials for mom'),
  ('Father''s Day', '2027-06-20', 'Steak, BBQ, and family dinner promos'),
  ('4th of July', '2027-07-04', 'Patio specials and summer promos'),
  ('Labor Day', '2027-09-06', 'End of summer / back to school promos'),
  ('Halloween', '2027-10-31', 'Themed specials and family events'),
  ('Thanksgiving', '2027-11-25', 'Pre-Thanksgiving and leftover promos'),
  ('Christmas Eve', '2027-12-24', 'Holiday dinner and catering promos'),
  ('New Year''s Eve', '2027-12-31', 'NYE party and prix fixe dinner');

-- Allow public access for the join signup page (contacts insert without auth)
CREATE POLICY "Public can join via signup" ON public.contacts FOR INSERT TO anon
  WITH CHECK (true);
