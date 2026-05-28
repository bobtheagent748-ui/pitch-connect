-- PitchConnect: Enforce unique emails per group (player can be in multiple groups)
-- Run in Supabase SQL Editor

-- 1. Find and remove duplicate emails within the same group (keep oldest record)
DELETE FROM players
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY league_id, email ORDER BY created_at ASC) AS rn
    FROM players
  ) dupes
  WHERE dupes.rn > 1
);

-- 2. Add unique constraint per group
ALTER TABLE players ADD CONSTRAINT players_league_email_unique UNIQUE (league_id, email);

-- 3. Verify no more duplicates
SELECT league_id, email, COUNT(*) AS cnt
FROM players
GROUP BY league_id, email
HAVING COUNT(*) > 1;
