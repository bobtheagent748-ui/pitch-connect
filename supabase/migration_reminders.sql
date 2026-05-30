-- PitchConnect: Add reminder tracking column to games
ALTER TABLE games ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;
