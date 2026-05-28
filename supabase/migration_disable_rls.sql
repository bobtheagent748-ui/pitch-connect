-- PitchConnect: Disable RLS on all tables (Option A — app-level access control)
-- Run in Supabase SQL Editor
-- The service_role key bypasses RLS server-side; anon key needs open access for client hooks.
-- Access control is enforced in application code, not Supabase RLS.

ALTER TABLE leagues DISABLE ROW LEVEL SECURITY;
ALTER TABLE games DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (cleanup — won't matter once RLS is off, but keeps things tidy)
DROP POLICY IF EXISTS "Authenticated can view leagues" ON leagues;
DROP POLICY IF EXISTS "Owner can update league" ON leagues;
DROP POLICY IF EXISTS "Owner can delete league" ON leagues;
DROP POLICY IF EXISTS "Authenticated can create leagues" ON leagues;
DROP POLICY IF EXISTS "Anyone can update leagues" ON leagues;
DROP POLICY IF EXISTS "Anyone can delete leagues" ON leagues;

DROP POLICY IF EXISTS "Members can view games" ON games;
DROP POLICY IF EXISTS "Members can insert games" ON games;
DROP POLICY IF EXISTS "Members can update games" ON games;
DROP POLICY IF EXISTS "Members can delete games" ON games;
DROP POLICY IF EXISTS "Anyone can view games" ON games;
DROP POLICY IF EXISTS "Anyone can insert games" ON games;

DROP POLICY IF EXISTS "Members can view players" ON players;
DROP POLICY IF EXISTS "Members can insert players" ON players;
DROP POLICY IF EXISTS "Members can update players" ON players;
DROP POLICY IF EXISTS "Members can delete players" ON players;
DROP POLICY IF EXISTS "Anyone can view players" ON players;
DROP POLICY IF EXISTS "Anyone can insert players" ON players;

DROP POLICY IF EXISTS "Members can view rsvps" ON rsvps;
DROP POLICY IF EXISTS "Members can insert rsvps" ON rsvps;
DROP POLICY IF EXISTS "Members can update rsvps" ON rsvps;
DROP POLICY IF EXISTS "Members can delete rsvps" ON rsvps;
DROP POLICY IF EXISTS "Anyone can view rsvps" ON rsvps;
DROP POLICY IF EXISTS "Anyone can insert rsvps" ON rsvps;

DROP FUNCTION IF EXISTS is_group_member(uuid);

-- Verify
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('leagues', 'games', 'players', 'rsvps');
