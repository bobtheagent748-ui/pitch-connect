'use client'

import { Users2, Search, Phone, Mail, Trash2, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PlayerListProps {
  players: any[]
  onRefresh: () => void
  rsvps: any[]
  onEdit?: (player: any) => void
  onDelete?: (playerId: string) => void
}

export function PlayerList({ players, onRefresh, rsvps, onEdit, onDelete }: PlayerListProps) {
  const [search, setSearch] = useState('')
  const filtered = players.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>
      
      <div className="divide-y divide-gray-50">
        {filtered.map(player => {
          const playerRsvps = rsvps.filter((r: any) => r.player_id === player.id)
          const rsvpMap = Object.fromEntries(playerRsvps.map((r: any) => [r.game_id, r.status]))
          const yesCount = playerRsvps.filter((r: any) => r.status === 'yes').length
          const maybeCount = playerRsvps.filter((r: any) => r.status === 'maybe').length

          return (
            <div key={player.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-medium">
                  {player.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{player.name}</h3>
                  <div className="flex gap-3 text-sm text-gray-500">
                    {player.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {player.email}
                      </span>
                    )}
                    {player.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {player.phone}
                      </span>
                    )}
                  </div>
                  {yesCount > 0 && (
                    <div className="mt-1 flex gap-2">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        {yesCount} confirmed
                      </span>
                      {maybeCount > 0 && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                          {maybeCount} maybe
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {onDelete || onEdit ? (
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(player)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit player"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(player.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
        
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <Users2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">No players found</p>
            <p className="text-gray-400 text-sm">Add your first player to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
