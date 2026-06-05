-- Supabase Schema for AuditLife

-- Clean up existing types and tables (Hanya untuk inisialisasi / Reset)
DROP TABLE IF EXISTS public.financial_records CASCADE;
DROP TABLE IF EXISTS public.reflections CASCADE;
DROP TABLE IF EXISTS public.scores CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.weekly_audit CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;
DROP TYPE IF EXISTS finance_type CASCADE;

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE activity_type AS ENUM ('produktif', 'non-produktif');
CREATE TYPE finance_type AS ENUM ('income', 'need', 'want', 'investment');

-- 2. Create public.users table (extends auth.users)
CREATE TABLE public.users (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert themselves" ON public.users FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Create categories table
CREATE TABLE public.categories (
  category_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name VARCHAR NOT NULL,
  type activity_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for categories (publicly readable by authenticated users)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Categories insertable by admin" ON public.categories FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- 4. Create weekly_audit table
CREATE TABLE public.weekly_audit (
  audit_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_time INTEGER DEFAULT 0,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.weekly_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own audits" ON public.weekly_audit FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audits" ON public.weekly_audit FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own audits" ON public.weekly_audit FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own audits" ON public.weekly_audit FOR DELETE USING (auth.uid() = user_id);

-- 5. Create activities table
CREATE TABLE public.activities (
  activity_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID REFERENCES public.weekly_audit(audit_id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(category_id) ON DELETE SET NULL,
  duration INTEGER NOT NULL,
  productivity_type activity_type NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activities" ON public.activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.weekly_audit WHERE audit_id = activities.audit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own activities" ON public.activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.weekly_audit WHERE audit_id = activities.audit_id AND user_id = auth.uid())
);

-- 6. Create scores table
CREATE TABLE public.scores (
  score_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID REFERENCES public.weekly_audit(audit_id) ON DELETE CASCADE NOT NULL UNIQUE,
  productivity_score DECIMAL DEFAULT 0,
  time_management_score DECIMAL DEFAULT 0,
  consistency_score DECIMAL DEFAULT 0,
  self_improvement_score DECIMAL DEFAULT 0,
  financial_discipline_score DECIMAL DEFAULT 0,
  spending_awareness_score DECIMAL DEFAULT 0,
  total_score DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.weekly_audit WHERE audit_id = scores.audit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own scores" ON public.scores FOR ALL USING (
  EXISTS (SELECT 1 FROM public.weekly_audit WHERE audit_id = scores.audit_id AND user_id = auth.uid())
);

-- 7. Create reflections table
CREATE TABLE public.reflections (
  reflection_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID REFERENCES public.weekly_audit(audit_id) ON DELETE CASCADE NOT NULL UNIQUE,
  positive_notes TEXT,
  improvement_notes TEXT,
  next_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reflections" ON public.reflections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.weekly_audit WHERE audit_id = reflections.audit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own reflections" ON public.reflections FOR ALL USING (
  EXISTS (SELECT 1 FROM public.weekly_audit WHERE audit_id = reflections.audit_id AND user_id = auth.uid())
);

-- 8. Create financial_records table
CREATE TABLE public.financial_records (
  record_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  category VARCHAR NOT NULL,
  amount DECIMAL NOT NULL,
  type finance_type NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own financial records" ON public.financial_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own financial records" ON public.financial_records FOR ALL USING (auth.uid() = user_id);

-- Optional: Create trigger to automatically create public.users on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (user_id, name, email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    new.email, 
    'user'::public.user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
