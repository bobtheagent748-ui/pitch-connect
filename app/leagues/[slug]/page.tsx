'use client'

import { useState } from 'react'
import { use } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLeague } from '@/lib/league-context'
import { useLeagues } from '@/hooks/use-leagues'
import { useGames } from '@/hooks/use-games'
import { usePlayers } from '@/hooks/use-players'
import { useRsvps } from '@/hooks/use-rsvps'
import { GameCard } from '@/components/game-card'
import { PlayerList } from '@/components/player-list'
import { ScheduleGameDialog } from '@/components/schedule-game-dialog'
import { Calendar, Users, Trophy } from 'lucide-react'

export default function LeagueDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const pathname = usePathname()
  const { activeLeague, setActiveLeague } = useLeague()
  const { leagues, getLeagueBySlug } = useLeagues()
  const { games, refreshGames, createGame, updateGame, deleteGame } = useGames(activeLeague)
  const { players, refreshPlayers, addPlayer, updatePlayer, deletePlayer } = usePlayers()
  const { rsvps, upsertRsvp, deleteRsvp, refresh: refreshRsvps } = useRsvps()

  const [showSchedule, setShowSchedule] = useState(false)
  const [editingGame, setEditingGame] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showAddPlayer, setShowAddPlayer] = useState(false)

  const leagueGames = games?.filter(g => g.league_id === activeLeague) || []
  const upcomingGames = leagueGames
    .filter(g => new Date(g.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const handleRsvp = async (gameId: string, playerId: string, status: 'yes' | 'no' | 'maybe') => {
    await upsertRsvp(gameId, playerId, status)
    await refreshRsvps()
  }

  const handleRemoveRsvp = async (gameId: string, playerId: string) => {
    await deleteRsvp(gameId, playerId)
    await refreshRsvps()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-red-500" />
            {slug === activeLeague
              ? leagues?.find(l => l.slug === activeLeague)?.name || slug
              : slug}
          </h1>
          <p className="text-gray-600 mt-1">Manage your league schedule and players</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSchedule(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Game
          </button>
          <button
            onClick={() => setShowAddPlayer(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Add Player
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{upcomingGames.length}</div>
          <div className="text-sm text-gray-600">Upcoming Games</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{players?.length || 0}</div>
          <div className="text-sm text-gray-600">Players</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {rsvps?.filter(r => r.status === 'yes')?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
      </div>

      {/* Upcoming Games */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-500" />
          Upcoming Games
        </h2>

        {upcomingGames.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-2">No upcoming games</p>
            <button
              onClick={() => setShowSchedule(true)}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Schedule your first game →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                players={players || []}
                rsvps={rsvps || []}
                onRefresh={refreshGames}
                onEdit={(g: any) => setEditingGame(g)}
                onDelete={(id: string) => setShowDeleteConfirm(id)}
                onRsvp={handleRsvp}
                onDeleteRsvp={handleRemoveRsvp}
              />
            ))}
          </div>
        )}
      </div>

      {/* Players */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-red-500" />
          Players ({players?.length || 0})
        </h2>
        <PlayerList
          players={players}
          onRefresh={refreshPlayers}
          rsvps={rsvps}
          onDelete={deletePlayer}
        />
      </div>

      {/* Modals */}
      <ScheduleGameDialog
        open={showSchedule}
        onClose={() => {
          setShowSchedule(false)
          setEditingGame(null)
        }}
        onSubmitted={() => {
          setEditingGame(null)
          refreshGames()
        }}
        editingGame={editingGame}
        createGame={createGame}
        updateGame={updateGame}
        leagueId={activeLeague}
      />
    </div>
  )
}
