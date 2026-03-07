
-- =============================================
-- UBA Database Schema
-- =============================================

-- Helper: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- 1. Role system
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'player');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'player',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 2. Profiles
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  discord_id TEXT,
  discord_username TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'player');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 3. Teams
-- =============================================
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbreviation TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#7c3aed',
  secondary_color TEXT DEFAULT '#1a1a2e',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams viewable by all authenticated" ON public.teams
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage teams" ON public.teams
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 4. Players
-- =============================================
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'PG',
  archetype TEXT DEFAULT 'Two-Way',
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  overall INTEGER NOT NULL DEFAULT 60,
  profile_image_url TEXT,
  uc_balance INTEGER NOT NULL DEFAULT 0,
  season INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  daily_streak INTEGER NOT NULL DEFAULT 0,
  last_daily_claim TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players viewable by all authenticated" ON public.players
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own player" ON public.players
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all players" ON public.players
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 5. Player Attributes
-- =============================================
CREATE TABLE public.player_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  value INTEGER NOT NULL DEFAULT 60,
  UNIQUE(player_id, name)
);
ALTER TABLE public.player_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attributes viewable by authenticated" ON public.player_attributes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage attributes" ON public.player_attributes
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 6. Player Badges
-- =============================================
CREATE TABLE public.player_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Bronze',
  category TEXT DEFAULT 'General',
  UNIQUE(player_id, name)
);
ALTER TABLE public.player_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges viewable by authenticated" ON public.player_badges
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage badges" ON public.player_badges
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 7. Player Tendencies
-- =============================================
CREATE TABLE public.player_tendencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 50,
  UNIQUE(player_id, name)
);
ALTER TABLE public.player_tendencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tendencies viewable by authenticated" ON public.player_tendencies
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage tendencies" ON public.player_tendencies
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 8. Player Hotzones
-- =============================================
CREATE TABLE public.player_hotzones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  zone TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'neutral',
  UNIQUE(player_id, zone)
);
ALTER TABLE public.player_hotzones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotzones viewable by authenticated" ON public.player_hotzones
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage hotzones" ON public.player_hotzones
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 9. Player Signatures
-- =============================================
CREATE TABLE public.player_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(player_id, category)
);
ALTER TABLE public.player_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signatures viewable by authenticated" ON public.player_signatures
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage signatures" ON public.player_signatures
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 10. Player Accessories
-- =============================================
CREATE TABLE public.player_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  slot TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(player_id, slot)
);
ALTER TABLE public.player_accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accessories viewable by authenticated" ON public.player_accessories
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage accessories" ON public.player_accessories
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 11. Player Gear
-- =============================================
CREATE TABLE public.player_gear (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  slot TEXT NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  UNIQUE(player_id, slot)
);
ALTER TABLE public.player_gear ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gear viewable by authenticated" ON public.player_gear
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage gear" ON public.player_gear
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 12. Player Gameplans
-- =============================================
CREATE TABLE public.player_gameplans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE UNIQUE,
  shot_tendency TEXT DEFAULT 'balanced',
  drive_tendency TEXT DEFAULT 'balanced',
  playmaking_focus TEXT DEFAULT 'balanced',
  defensive_aggression TEXT DEFAULT 'balanced',
  rebounding_priority TEXT DEFAULT 'balanced',
  tempo TEXT DEFAULT 'balanced',
  usage TEXT DEFAULT 'moderate',
  freelance_style TEXT DEFAULT 'default',
  custom_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.player_gameplans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gameplans viewable by authenticated" ON public.player_gameplans
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own gameplan" ON public.player_gameplans
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.players WHERE players.id = player_gameplans.player_id AND players.user_id = auth.uid()));
CREATE POLICY "Admins can manage gameplans" ON public.player_gameplans
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_gameplans_updated_at BEFORE UPDATE ON public.player_gameplans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 13. Transactions
-- =============================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.players WHERE players.id = transactions.player_id AND players.user_id = auth.uid()));
CREATE POLICY "Admins can manage transactions" ON public.transactions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 14. Daily Claims
-- =============================================
CREATE TABLE public.daily_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reward_amount INTEGER NOT NULL,
  streak_day INTEGER NOT NULL DEFAULT 1
);
ALTER TABLE public.daily_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims" ON public.daily_claims
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.players WHERE players.id = daily_claims.player_id AND players.user_id = auth.uid()));
CREATE POLICY "Users can insert own claims" ON public.daily_claims
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.players WHERE players.id = daily_claims.player_id AND players.user_id = auth.uid()));
CREATE POLICY "Admins can manage claims" ON public.daily_claims
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 15. League Settings
-- =============================================
CREATE TABLE public.league_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.league_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by authenticated" ON public.league_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage settings" ON public.league_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.league_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default league settings
INSERT INTO public.league_settings (key, value, description, category) VALUES
  ('attribute_upgrade_base_cost', '200', 'Base UC cost for attribute upgrades', 'economy'),
  ('attribute_upgrade_per_point', '15', 'Additional UC cost per current attribute point', 'economy'),
  ('badge_upgrade_cost_bronze_to_silver', '500', 'UC cost to upgrade badge from Bronze to Silver', 'economy'),
  ('badge_upgrade_cost_silver_to_gold', '1000', 'UC cost to upgrade badge from Silver to Gold', 'economy'),
  ('badge_upgrade_cost_gold_to_hof', '2000', 'UC cost to upgrade badge from Gold to HOF', 'economy'),
  ('tendency_change_cost', '300', 'UC cost to change a tendency', 'economy'),
  ('hotzone_change_cost', '400', 'UC cost to change a hotzone', 'economy'),
  ('daily_reward_base', '500', 'Base daily reward UC amount', 'rewards'),
  ('daily_reward_streak_bonus', '100', 'Additional UC per streak day', 'rewards'),
  ('daily_reward_streak_max', '7', 'Max streak days before reset', 'rewards'),
  ('season_number', '1', 'Current season number', 'general');

-- =============================================
-- 16. Announcements
-- =============================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements viewable by authenticated" ON public.announcements
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Storage bucket for player/team images
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Admins can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));
