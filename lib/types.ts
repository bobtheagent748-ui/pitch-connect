// Game and Player types (matching Supabase schema)
export type Game = {
  id: string
  field_name: string
  full_address: string
  date: string
  time: string
  notes: string
  created_at: string
}

export type GameWithPlayers = Game & { players?: { name: string }[] }

// Player
export type Player = {
  id: string
  name: string
  phone: string
  email: string
  created_at: string
}

// RSVP
export type RSVP = {
  id: string
  game_id: string
  player_id: string
  status: string
  created_at: string
}

// Input types for forms
export type NewGameData = {
  field_name: string
  full_address: string
  date: string
  time: string
  notes?: string
}

export type NewPlayerData = {
  name: string
  phone?: string
  email?: string
}
