
-- App role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table (never store roles on profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can read user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- App settings table (for storing API keys, config)
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage app settings"
  ON public.app_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Restaurants table
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  phone TEXT,
  slow_days TEXT[] DEFAULT '{}',
  meal_service TEXT DEFAULT 'both',
  promo_styles TEXT[] DEFAULT '{}',
  join_incentive TEXT,
  public_signup_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  auto_send_enabled BOOLEAN DEFAULT false,
  max_auto_per_week INTEGER DEFAULT 2,
  auto_send_days TEXT[] DEFAULT '{}',
  done_for_you_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own restaurants"
  ON public.restaurants FOR SELECT TO authenticated
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Admins can view all restaurants"
  ON public.restaurants FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can update own restaurants"
  ON public.restaurants FOR UPDATE TO authenticated
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Owners can insert restaurants"
  ON public.restaurants FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Admins can manage all restaurants"
  ON public.restaurants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed initial app settings
INSERT INTO public.app_settings (key, value, description) VALUES
  ('sms_provider', 'textbelt', 'Current SMS provider (textbelt or twilio)'),
  ('textbelt_region', 'us', 'Textbelt requires US-based API calls'),
  ('weather_api_provider', 'openweathermap', 'Weather data provider'),
  ('max_suggestions_per_day', '5', 'Maximum campaign suggestions per restaurant per day');
