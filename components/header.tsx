'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useGroup } from '@/lib/group-context'
import { useGroups } from '@/hooks/use-groups'
import { Home, Trophy, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const pathname = usePathname()
  const { activeGroup } = useGroup()
  const { groups } = useGroups()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentGroupName = activeGroup
    ? groups?.find(g => g.slug === activeGroup)?.name || activeGroup
    : null

  const isGroupPage = pathname?.startsWith('/groups/')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-red-500 font-bold text-lg">
            <Trophy className="w-6 h-6" />
            PitchConnect
          </Link>
          
          {isGroupPage && currentGroupName && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <Trophy className="w-4 h-4 text-red-500" />
                <span className="max-w-[150px] truncate">{currentGroupName}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <Link href="/" onClick={() => setShowDropdown(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                  <Link href="/groups" onClick={() => setShowDropdown(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">All Groups</Link>
                  {groups?.map(group => (
                    <Link
                      key={group.id}
                      href={`/groups/${group.slug}/games`}
                      onClick={() => setShowDropdown(false)}
                      className={`block px-3 py-2 text-sm hover:bg-gray-50 ${
                        activeGroup === group.slug ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {group.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</Link>
          <Link href="/groups" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Groups</Link>
        </nav>
      </div>
    </header>
  )
}
