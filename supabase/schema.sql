-- PitchConnect Schema
-- Run in Supabase SQL Editor

create table games (
  id uuid default gen_random_uuid() primary key,
  field_name text not null,
  full_address text not null,
  date date not null,
  time time not null,
  notes text default '',
  created_at timestamp with time zone default now()
);

create table players (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text,
  email text,
  created_at timestamp with time zone default now()
);

create table rsvps (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references games(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  status text check (status in ('yes', 'no', 'maybe')) not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table games enable row level security;
alter table players enable row level security;
alter table rsvps enable row level security;

-- Everyone can read games
create policy "Anyone can view games" on games for select using (true);
create policy "Anyone can view players" on players for select using (true);
create policy "Anyone can view rsvps" on rsvps for select using (true);

-- Allow insert for unauthenticated (we'll add auth later)
create policy "Anyone can insert games" on games for insert with check (true);
create policy "Anyone can insert players" on players for insert with check (true);
create policy "Anyone can insert rsvps" on rsvps for insert with check (true);
