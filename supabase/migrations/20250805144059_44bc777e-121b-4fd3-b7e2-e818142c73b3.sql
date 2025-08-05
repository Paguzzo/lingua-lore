-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'author');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role app_role DEFAULT 'author',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'author'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to check user role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS app_role AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update existing RLS policies to use the new role system
-- Update posts policies
DROP POLICY IF EXISTS "Admin full access to posts" ON public.posts;
CREATE POLICY "Admins and editors can manage posts" ON public.posts
  FOR ALL USING (public.get_user_role() IN ('admin', 'editor'));

CREATE POLICY "Authors can manage their own posts" ON public.posts
  FOR ALL USING (
    public.get_user_role() = 'author' AND 
    author_name = (SELECT full_name FROM public.profiles WHERE user_id = auth.uid())
  );

-- Update categories policies  
DROP POLICY IF EXISTS "Admin full access to categories" ON public.categories;
CREATE POLICY "Admins and editors can manage categories" ON public.categories
  FOR ALL USING (public.get_user_role() IN ('admin', 'editor'));

-- Update affiliate_links policies
DROP POLICY IF EXISTS "Admin full access to affiliate links" ON public.affiliate_links;
CREATE POLICY "Admins and editors can manage affiliate links" ON public.affiliate_links
  FOR ALL USING (public.get_user_role() IN ('admin', 'editor'));

-- Update ctas policies
DROP POLICY IF EXISTS "Admin full access to CTAs" ON public.ctas;
CREATE POLICY "Admins and editors can manage CTAs" ON public.ctas
  FOR ALL USING (public.get_user_role() IN ('admin', 'editor'));

-- Update media policies
DROP POLICY IF EXISTS "Admin full access to media" ON public.media;
CREATE POLICY "Admins and editors can manage media" ON public.media
  FOR ALL USING (public.get_user_role() IN ('admin', 'editor'));

-- Update site_settings policies
DROP POLICY IF EXISTS "Admin full access to site settings" ON public.site_settings;
CREATE POLICY "Only admins can manage site settings" ON public.site_settings
  FOR ALL USING (public.get_user_role() = 'admin');

-- Update webhooks policies
DROP POLICY IF EXISTS "Admin full access to webhooks" ON public.webhooks;
CREATE POLICY "Only admins can manage webhooks" ON public.webhooks
  FOR ALL USING (public.get_user_role() = 'admin');

-- Add trigger for updating updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create analytics table for tracking
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  post_id UUID REFERENCES public.posts(id),
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics" ON public.analytics
  FOR SELECT USING (public.get_user_role() = 'admin');