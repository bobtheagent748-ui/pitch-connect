export type Game = {
  id: string
  league_id: string
  field_name: string
  full_address: string
  date: string
  time: string
  notes: string
  created_at: string
}

export type NewGame = Omit<Game, 'id' | 'created_at' | 'league_id'>

export type NewGameData = Omit<NewGame, 'id' | 'created_at' | 'league_id'> & { league_id: string }

export type Player = {
  id: string
  league_id: string
  name: string
  email: string
  phone: string
  position: string
  created_at: string
}

export type NewPlayer = Omit<Player, 'id' | 'created_at' | 'league_id'>

export type RSVP = {
  id: string
  game_id: string
  player_id: string
  league_id: string
  status: 'yes' | 'no' | 'maybe'
  created_at: string
}

export type Group = {
  id: string
  name: string
  slug: string
  description: string | null
  owner_id: string | null
  deleted_at: string | null
  created_at: string
}

export type NewGroup = Omit<Group, 'id' | 'created_at'>
