-- Add phone and position columns to users table for profile page
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS position TEXT;

-- Add position column to players table for player management
ALTER TABLE players ADD COLUMN IF NOT EXISTS position TEXT;

-- Verification
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'players')
  AND column_name IN ('phone', 'position')
ORDER BY table_name, column_name;
