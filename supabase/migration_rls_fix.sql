-- PitchConnect: Fix missing RLS policies for leagues (UPDATE + DELETE)
-- Run in Supabase SQL Editor
-- These are the ONLY missing policies. Games, players, rsvps already have them.

ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can update leagues" ON leagues;
CREATE POLICY "Anyone can update leagues" ON leagues FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete leagues" ON leagues;
CREATE POLICY "Anyone can delete leagues" ON leagues FOR DELETE USING (true);

-- Verify
SELECT tablename, cmd FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'leagues'
ORDER BY cmd;
