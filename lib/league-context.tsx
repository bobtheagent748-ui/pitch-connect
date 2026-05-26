'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type LeagueContextType = {
  activeLeague: string | null
  setActiveLeague: (slug: string | null) => void
}

const LeagueContext = createContext<LeagueContextType | null>(null)

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [activeLeague, setActiveLeague] = useState<string | null>(null)

  return (
    <LeagueContext.Provider value={{ activeLeague, setActiveLeague }}>
      {children}
    </LeagueContext.Provider>
  )
}

export function useLeague() {
  const ctx = useContext(LeagueContext)
  if (!ctx) throw new Error('useLeague must be used within LeagueProvider')
  return ctx
}
