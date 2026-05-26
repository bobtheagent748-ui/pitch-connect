'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLeague } from '@/lib/league-context'
import { useLeagues } from '@/hooks/use-leagues'
import { Calendar, Users, Trophy, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const pathname = usePathname()
  const { activeLeague: leagueSlug, setActiveLeague } = useLeague()
  const { leagues } = useLeagues()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLeagueName = leagueSlug
    ? leagues?.find(l => l.slug === leagueSlug)?.name || leagueSlug
    : null

  const isLeaguePage = pathname?.startsWith('/leagues/') || pathname?.startsWith('/leagues')

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
          <Link href="/leagues" className="flex items-center gap-2 text-red-500 font-bold text-lg">
            <Trophy className="w-6 h-6" />
            Leagues
          </Link>
          
          {isLeaguePage && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <Trophy className="w-4 h-4 text-red-500" />
                <span className="max-w-[150px] truncate">{currentLeagueName}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/leagues"
                    onClick={() => setShowDropdown(false)}
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    All Leagues
                  </Link>
                  {leagues?.map(league => (
                    <Link
                      key={league.id}
                      href={`/leagues/${league.slug}`}
                      onClick={() => {
                        setActiveLeague(league.slug)
                        setShowDropdown(false)
                      }}
                      className={`block px-3 py-2 text-sm hover:bg-gray-50 ${
                        leagueSlug === league.slug
                          ? 'bg-red-50 text-red-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {league.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <nav className="flex items-center gap-4">
          <Link
            href={leagueSlug ? `/leagues/${leagueSlug}/games` : "/leagues/games"}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Games
          </Link>
          <Link
            href={leagueSlug ? `/leagues/${leagueSlug}/players` : "/leagues/players"}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Players
          </Link>
          <Link
            href={leagueSlug ? `/leagues/${leagueSlug}` : "/leagues"}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            League
          </Link>
        </nav>
      </div>
    </header>
  )
}
