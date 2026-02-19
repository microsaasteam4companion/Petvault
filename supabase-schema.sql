-- TailVault Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  age INTEGER,
  gender VARCHAR(50),
  weight DECIMAL(10, 2),
  photo_url TEXT,
  microchip_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TIMELINE ENTRIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS timeline_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('vaccine', 'illness', 'food', 'weight', 'behavior', 'vet_visit', 'other')),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES timeline_entries(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUBSCRIBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index on user_id for quick pet lookups
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);

-- Index on pet_id for timeline entries
CREATE INDEX IF NOT EXISTS idx_timeline_entries_pet_id ON timeline_entries(pet_id);

-- Index on date for sorting timeline entries
CREATE INDEX IF NOT EXISTS idx_timeline_entries_date ON timeline_entries(date DESC);

-- Index on category for filtering
CREATE INDEX IF NOT EXISTS idx_timeline_entries_category ON timeline_entries(category);

-- Index on entry_id for file lookups
CREATE INDEX IF NOT EXISTS idx_files_entry_id ON files(entry_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Pets policies: Users can only access their own pets
CREATE POLICY "Users can view their own pets"
  ON pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE
  USING (auth.uid() = user_id);

-- Timeline entries policies: Users can only access entries for their pets
CREATE POLICY "Users can view timeline entries for their pets"
  ON timeline_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = timeline_entries.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert timeline entries for their pets"
  ON timeline_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = timeline_entries.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update timeline entries for their pets"
  ON timeline_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = timeline_entries.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete timeline entries for their pets"
  ON timeline_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = timeline_entries.pet_id
      AND pets.user_id = auth.uid()
    )
  );

-- Files policies: Users can only access files for their timeline entries
CREATE POLICY "Users can view files for their entries"
  ON files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM timeline_entries
      JOIN pets ON pets.id = timeline_entries.pet_id
      WHERE timeline_entries.id = files.entry_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files for their entries"
  ON files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM timeline_entries
      JOIN pets ON pets.id = timeline_entries.pet_id
      WHERE timeline_entries.id = files.entry_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files for their entries"
  ON files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM timeline_entries
      JOIN pets ON pets.id = timeline_entries.pet_id
      WHERE timeline_entries.id = files.entry_id
      AND pets.user_id = auth.uid()
    )
  );

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Note: You need to create storage buckets in Supabase Dashboard
-- 1. Create bucket: "pet-photos" (public)
-- 2. Create bucket: "entry-files" (public or private based on security needs)

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for pets table
CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for timeline_entries table
CREATE TRIGGER update_timeline_entries_updated_at
  BEFORE UPDATE ON timeline_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================= 
-- SUBSCRIBERS POLICIES
-- =============================================
-- Allow anyone to subscribe (insert only)
CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- No one can read subscribers (admin only via direct SQL)
-- No select, update, or delete policies = no public access

-- =============================================
-- PROFILES TABLE & SUBSCRIPTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro')),
  subscription_status VARCHAR(50) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive')),
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, plan_type, subscription_status)
  VALUES (NEW.id, 'basic', 'inactive');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- REMINDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  type VARCHAR(50) DEFAULT 'in-app' CHECK (type IN ('in-app', 'email')),
  recurring BOOLEAN DEFAULT FALSE,
  recurring_interval VARCHAR(50) CHECK (recurring_interval IN ('yearly')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CHAT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
