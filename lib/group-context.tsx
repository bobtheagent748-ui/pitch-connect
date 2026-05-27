'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useGroups } from '@/hooks/use-groups'

type GroupContextType = {
  activeGroup: string | null
  setActiveGroup: (slug: string | null) => void
}

const GroupContext = createContext<GroupContextType | null>(null)

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const { groups, loading } = useGroups()

  useEffect(() => {
    if (!loading && !activeGroup && groups && groups.length > 0) {
      setActiveGroup(groups[0].slug)
    }
  }, [loading, groups, activeGroup])

  return (
    <GroupContext.Provider value={{ activeGroup, setActiveGroup }}>
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  const ctx = useContext(GroupContext)
  if (!ctx) throw new Error('useGroup must be used within GroupProvider')
  return ctx
}
