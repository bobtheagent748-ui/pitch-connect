-- PitchConnect: Add ownership and roles to groups (was: leagues)
-- Run in Supabase SQL Editor

-- Add owner_id to leagues table (who created/owns the group)
ALTER TABLE leagues ADD COLUMN IF NOT EXISTS owner_id UUID;

-- Add role to league_members (admin, member, invited)
ALTER TABLE league_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' 
  CHECK (role IN ('admin', 'member', 'invited'));

-- Make existing league creator the owner (if any rows exist)
-- For now, set first league's owner to null until auth is added
-- When auth is set up, you can run:
-- UPDATE leagues SET owner_id = <user_uuid> WHERE owner_id IS NULL;

-- Verification
SELECT table_name, column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('leagues', 'league_members')
  AND column_name IN ('owner_id', 'role')
ORDER BY table_name, column_name;
