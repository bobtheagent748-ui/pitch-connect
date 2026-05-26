'use client'

import { Users2, Search, Phone, Mail, Trash2, Pencil, UserPlus } from 'lucide-react'
import { useState } from 'react'

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
    <div>
      {/* Header with search */}
      <div className="flex items-center justify-between mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-3 py-2 rounded-lg transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Player
          </button>
        )}
      </div>

      {/* Compact grid/list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users2 className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-slate-600 font-medium">No players yet</p>
          <p className="text-slate-400 text-xs mt-1">
            {players.length > 0 ? 'No matches for this search' : 'Tap "Add Player" to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(player => {
            const playerRsvps = rsvps.filter((r: any) => r.player_id === player.id)
            const yesCount = playerRsvps.filter((r: any) => r.status === 'yes').length
            const maybeCount = playerRsvps.filter((r: any) => r.status === 'maybe').length
            const attendancePct = playerRsvps.length > 0 
              ? Math.round(((yesCount + maybeCount) / playerRsvps.length) * 100) 
              : 0

            return (
              <div
                key={player.id}
                className="group flex items-center gap-3 p-3 bg-white border border-slate-100 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition"
              >
                {/* Avatar */}
                <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {player.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900 truncate">{player.name}</h3>
                    {/* Attendance badge */}
                    {playerRsvps.length > 0 && (
                      <span
                        className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          attendancePct >= 75 
                            ? 'bg-green-100 text-green-700' 
                            : attendancePct >= 50 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {attendancePct}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-x-3 text-xs text-slate-400 mt-0.5">
                    {player.email && (
                      <span className={`truncate ${player.email ? 'flex' : 'hidden'}`}>
                        <Mail className="w-3 h-3 inline mr-0.5" />
                        {player.email}
                      </span>
                    )}
                    {player.phone && (
                      <span className="flex">
                        <Phone className="w-3 h-3 inline mr-0.5" />
                        {player.phone}
                      </span>
                    )}
                    {playerRsvps.length > 0 && (
                      <span className="text-xs text-slate-400">
                        {yesCount}Y · {maybeCount}M · {playerRsvps.length - yesCount - maybeCount}N
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {(onDelete || onEdit) && (
                  <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(player)}
                        className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                        title="Edit player"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(player.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Delete player"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
