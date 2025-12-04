-- =====================================================
-- Schema Database Supabase - Andiamo Oltre
-- =====================================================
-- ISTRUZIONI:
-- 1. Vai su https://urranypfrxpvrhgkfhjy.supabase.co
-- 2. Clicca su "SQL Editor" nel menu laterale
-- 3. Copia e incolla questo intero file
-- 4. Clicca "Run" per eseguire
-- =====================================================

-- Tabella Membri del Partito
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  email TEXT,
  phone TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella News/Proposte
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  text TEXT NOT NULL,
  date_day TEXT NOT NULL,
  date_month TEXT NOT NULL,
  date_year INTEGER NOT NULL,
  video_url TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Segnalazioni dai Cittadini
CREATE TABLE IF NOT EXISTS contact_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  surname TEXT,
  email TEXT,
  phone TEXT,
  description TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ABILITAZIONE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES - Accesso Pubblico in Lettura
-- =====================================================

-- Policy: Tutti possono leggere i membri
DROP POLICY IF EXISTS "Public can view members" ON members;
CREATE POLICY "Public can view members" 
  ON members FOR SELECT 
  USING (true);

-- Policy: Tutti possono leggere le news
DROP POLICY IF EXISTS "Public can view news" ON news;
CREATE POLICY "Public can view news" 
  ON news FOR SELECT 
  USING (true);

-- =====================================================
-- POLICIES - Solo Admin Autenticati Possono Modificare
-- =====================================================

-- Policy: Solo admin possono inserire membri
DROP POLICY IF EXISTS "Authenticated users can insert members" ON members;
CREATE POLICY "Authenticated users can insert members" 
  ON members FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Solo admin possono aggiornare membri
DROP POLICY IF EXISTS "Authenticated users can update members" ON members;
CREATE POLICY "Authenticated users can update members" 
  ON members FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy: Solo admin possono eliminare membri
DROP POLICY IF EXISTS "Authenticated users can delete members" ON members;
CREATE POLICY "Authenticated users can delete members" 
  ON members FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Policy: Solo admin possono inserire news
DROP POLICY IF EXISTS "Authenticated users can insert news" ON news;
CREATE POLICY "Authenticated users can insert news" 
  ON news FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Solo admin possono aggiornare news
DROP POLICY IF EXISTS "Authenticated users can update news" ON news;
CREATE POLICY "Authenticated users can update news" 
  ON news FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy: Solo admin possono eliminare news
DROP POLICY IF EXISTS "Authenticated users can delete news" ON news;
CREATE POLICY "Authenticated users can delete news" 
  ON news FOR DELETE 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- POLICIES - Segnalazioni
-- =====================================================

-- Policy: Chiunque può creare una segnalazione
DROP POLICY IF EXISTS "Anyone can create contact reports" ON contact_reports;
CREATE POLICY "Anyone can create contact reports" 
  ON contact_reports FOR INSERT 
  WITH CHECK (true);

-- Policy: Solo admin possono leggere le segnalazioni
DROP POLICY IF EXISTS "Authenticated users can view contact reports" ON contact_reports;
CREATE POLICY "Authenticated users can view contact reports" 
  ON contact_reports FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy: Solo admin possono aggiornare le segnalazioni (es. marcare come lette)
DROP POLICY IF EXISTS "Authenticated users can update contact reports" ON contact_reports;
CREATE POLICY "Authenticated users can update contact reports" 
  ON contact_reports FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- DONE! 🎉
-- =====================================================
-- Le tabelle sono state create con successo.
-- Ora puoi creare un utente admin:
-- 1. Vai su "Authentication" > "Users"
-- 2. Clicca "Invite user" 
-- 3. Inserisci l'email admin (es. andiamooltre@gmail.com)
-- 4. Inserisci una password sicura
-- =====================================================
