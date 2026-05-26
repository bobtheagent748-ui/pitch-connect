export type Game = {
  id: string
  league_id: string | null
  field_name: string
  full_address: string
  date: string
  time: string
  notes: string
  created_at: string
}

export type NewGame = Omit<Game, 'id' | 'created_at' | 'league_id'>

export type NewGameData = Omit<NewGame, 'id' | 'created_at' | 'league_id'> & { league_id?: string }

export type Player = {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
}

export type NewPlayer = Omit<Player, 'id' | 'created_at'>

export type RSVP = {
  id: string
  game_id: string
  player_id: string
  status: 'yes' | 'no' | 'maybe'
  created_at: string
}

export type League = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export type NewLeague = Omit<League, 'id' | 'created_at'>
