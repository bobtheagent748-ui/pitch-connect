-- leagues table
CREATE TABLE leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- league_members bridge table
CREATE TABLE league_members (
  league_id uuid REFERENCES leagues(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  PRIMARY KEY (league_id, player_id)
);

-- Add league_id to games
ALTER TABLE games ADD COLUMN league_id uuid REFERENCES leagues(id) ON DELETE SET NULL;
