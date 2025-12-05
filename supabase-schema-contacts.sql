-- =====================================================
-- CONTACTS TABLE
-- =====================================================
-- Table to store website contact information (single record)

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(50),
  email VARCHAR(255),
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default contact information
INSERT INTO contacts (phone, email, instagram, facebook) 
VALUES (
  '+39 333 999 8888',
  'info@andiamooltre.it',
  '@partito_andiamo_oltre',
  'Partito Andiamo Oltre'
)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Enable read access for all users" ON contacts
FOR SELECT USING (true);

-- Policy: Allow authenticated users to update
CREATE POLICY "Enable update for authenticated users only" ON contacts
FOR UPDATE USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
