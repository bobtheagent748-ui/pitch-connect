-- PitchConnect: Proper RLS policies (replaces all (true) policies)
-- Run in Supabase SQL Editor
-- Requires the NextAuth→Supabase JWT bridge to be active for write operations

-- ============================================================
-- 1. DROP all existing permissive policies
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view games" ON games;
DROP POLICY IF EXISTS "Anyone can insert games" ON games;
DROP POLICY IF EXISTS "Anyone can view players" ON players;
DROP POLICY IF EXISTS "Anyone can insert players" ON players;
DROP POLICY IF EXISTS "Anyone can view rsvps" ON rsvps;
DROP POLICY IF EXISTS "Anyone can insert rsvps" ON rsvps;
DROP POLICY IF EXISTS "Anyone can update leagues" ON leagues;
DROP POLICY IF EXISTS "Anyone can delete leagues" ON leagues;

-- ============================================================
-- 2. Helper: check if user belongs to a group
-- ============================================================
CREATE OR REPLACE FUNCTION is_group_member(group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM players
    WHERE league_id = group_id
    AND email = (
      SELECT email FROM users WHERE id = auth.uid()
    )
  )
  OR EXISTS (
    SELECT 1 FROM leagues
    WHERE id = group_id
    AND owner_id = auth.uid()
  );
$$;

-- ============================================================
-- 3. LEAGUES (groups)
-- ============================================================
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view non-deleted groups
CREATE POLICY "Authenticated can view leagues" ON leagues
  FOR SELECT USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

-- Only the owner can update their group
CREATE POLICY "Owner can update league" ON leagues
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only the owner can soft-delete their group
CREATE POLICY "Owner can delete league" ON leagues
  FOR DELETE USING (auth.uid() = owner_id);

-- Authenticated users can create groups
CREATE POLICY "Authenticated can create leagues" ON leagues
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 4. GAMES
-- ============================================================
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Members can view games for their groups
CREATE POLICY "Members can view games" ON games
  FOR SELECT USING (is_group_member(league_id));

-- Members can create games for their groups
CREATE POLICY "Members can insert games" ON games
  FOR INSERT WITH CHECK (is_group_member(league_id));

-- Members can update games for their groups  
CREATE POLICY "Members can update games" ON games
  FOR UPDATE USING (is_group_member(league_id));

-- Members can delete games for their groups
CREATE POLICY "Members can delete games" ON games
  FOR DELETE USING (is_group_member(league_id));

-- ============================================================
-- 5. PLAYERS
-- ============================================================
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Members can view players in their groups
CREATE POLICY "Members can view players" ON players
  FOR SELECT USING (is_group_member(league_id));

-- Members can add players to their groups
CREATE POLICY "Members can insert players" ON players
  FOR INSERT WITH CHECK (is_group_member(league_id));

-- Members can update players in their groups
CREATE POLICY "Members can update players" ON players
  FOR UPDATE USING (is_group_member(league_id));

-- Members can delete players from their groups
CREATE POLICY "Members can delete players" ON players
  FOR DELETE USING (is_group_member(league_id));

-- ============================================================
-- 6. RSVPS
-- ============================================================
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Members can view RSVPs for their groups (via game's group)
CREATE POLICY "Members can view rsvps" ON rsvps
  FOR SELECT USING (is_group_member(league_id));

-- Members can RSVP (insert)
CREATE POLICY "Members can insert rsvps" ON rsvps
  FOR INSERT WITH CHECK (is_group_member(league_id));

-- Members can update their own RSVPs
CREATE POLICY "Members can update rsvps" ON rsvps
  FOR UPDATE USING (is_group_member(league_id));

-- Members can delete RSVPs in their groups
CREATE POLICY "Members can delete rsvps" ON rsvps
  FOR DELETE USING (is_group_member(league_id));

-- ============================================================
-- 7. VERIFICATION
-- ============================================================
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
