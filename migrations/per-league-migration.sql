-- PitchConnect: Per-League Migration
-- Paste into Supabase Dashboard → SQL Editor → Run (click "Run" on the first button)

-- ============================================
-- STEP 1: Add league_id columns (safe to re-run)
-- ============================================

-- players
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'league_id'
  ) THEN
    ALTER TABLE players ADD COLUMN league_id UUID REFERENCES leagues(id);
    RAISE NOTICE 'Added league_id to players';
  ELSE
    RAISE NOTICE 'players already has league_id';
  END IF;
END $$;

-- rsvps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rsvps' AND column_name = 'league_id'
  ) THEN
    ALTER TABLE rsvps ADD COLUMN league_id UUID REFERENCES leagues(id);
    RAISE NOTICE 'Added league_id to rsvps';
  ELSE
    RAISE NOTICE 'rsvps already has league_id';
  END IF;
END $$;

-- games (in case it doesn't have one already)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'league_id'
  ) THEN
    ALTER TABLE games ADD COLUMN league_id UUID REFERENCES leagues(id);
    RAISE NOTICE 'Added league_id to games';
  ELSE
    RAISE NOTICE 'games already has league_id';
  END IF;
END $$;

-- ============================================
-- STEP 2: Find or create default league
-- ============================================

DO $$
DECLARE
  default_league_id UUID;
  league_count INT;
BEGIN
  SELECT COUNT(*) INTO league_count FROM leagues;

  IF league_count = 0 THEN
    INSERT INTO leagues (name, slug, description)
    VALUES ('My League', 'my-league', '')
    RETURNING id INTO default_league_id;
    RAISE NOTICE 'Created default league: %', default_league_id;
  ELSE
    SELECT id INTO default_league_id
    FROM leagues
    ORDER BY created_at ASC
    LIMIT 1;
    RAISE NOTICE 'Using existing league: %', default_league_id;
  END IF;

  -- ============================================
  -- STEP 3: Migrate existing rows
  -- ============================================
  UPDATE players SET league_id = default_league_id WHERE league_id IS NULL;
  UPDATE games SET league_id = default_league_id WHERE league_id IS NULL;
  UPDATE rsvps SET league_id = g.league_id
  FROM games g WHERE g.id = rsvps.game_id AND rsvps.league_id IS NULL;

  -- Count migrated
  RAISE NOTICE 'Migrated: players=% games=% rsvps=%',
    (SELECT count(*) FROM players WHERE league_id = default_league_id),
    (SELECT count(*) FROM games WHERE league_id = default_league_id),
    (SELECT count(*) FROM rsvps WHERE league_id = default_league_id);

  -- ============================================
  -- STEP 4: Make NOT NULL (only if there are no NULLs)
  -- ============================================
  IF (SELECT count(*) FROM players WHERE league_id IS NULL) = 0 THEN
    ALTER TABLE players ALTER COLUMN league_id SET NOT NULL;
    RAISE NOTICE 'players.league_id is now NOT NULL';
  ELSE
    RAISE WARNING 'Some players have NULL league_id — skipping NOT NULL constraint';
  END IF;

  IF (SELECT count(*) FROM rsvps WHERE league_id IS NULL) = 0 THEN
    ALTER TABLE rsvps ALTER COLUMN league_id SET NOT NULL;
    RAISE NOTICE 'rsvps.league_id is now NOT NULL';
  ELSE
    RAISE WARNING 'Some rsvps have NULL league_id — skipping NOT NULL constraint';
  END IF;

  IF (SELECT count(*) FROM games WHERE league_id IS NULL) = 0 THEN
    ALTER TABLE games ALTER COLUMN league_id SET NOT NULL;
    RAISE NOTICE 'games.league_id is now NOT NULL';
  ELSE
    RAISE WARNING 'Some games have NULL league_id — skipping NOT NULL constraint';
  END IF;

  -- ============================================
  -- STEP 5: Set defaults using EXECUTE (can't use PL/pgSQL var inline in DDL)
  -- ============================================
  EXECUTE 'ALTER TABLE players ALTER COLUMN league_id SET DEFAULT ''' || default_league_id::text || '''';
  EXECUTE 'ALTER TABLE rsvps ALTER COLUMN league_id SET DEFAULT ''' || default_league_id::text || '''';
  EXECUTE 'ALTER TABLE games ALTER COLUMN league_id SET DEFAULT ''' || default_league_id::text || '''';
  RAISE NOTICE 'Defaults set to %', default_league_id;

END $$;

-- ============================================
-- STEP 6: Verification (these are just SELECTs, outside DO block)
-- ============================================
SELECT table_name, column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND column_name = 'league_id'
ORDER BY table_name;

SELECT 'players' AS table_name, COUNT(*) FROM players
UNION ALL SELECT 'games', COUNT(*) FROM games
UNION ALL SELECT 'rsvps', COUNT(*) FROM rsvps
UNION ALL SELECT 'leagues', COUNT(*) FROM leagues;
