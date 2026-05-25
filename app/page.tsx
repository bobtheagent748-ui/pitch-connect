'use client'

import { useState } from 'react'
import { useGames } from '@/hooks/use-games'
import { usePlayers } from '@/hooks/use-players'
import { useRsvps } from '@/hooks/use-rsvps'
import { GameCard } from '@/components/game-card'
import { PlayerList } from '@/components/player-list'
import { ScheduleGameDialog } from '@/components/schedule-game-dialog'
import { AddPlayerDialog } from '@/components/add-player-dialog'
import { Calendar, Users, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { games, refreshGames, createGame, updateGame, deleteGame } = useGames()
  const { players, refreshPlayers, addPlayer, updatePlayer, deletePlayer } = usePlayers()
  const { rsvps, upsertRsvp, deleteRsvp, refresh } = useRsvps()
  const [showSchedule, setShowSchedule] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [editingGame, setEditingGame] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleEdit = (game: any) => {
    setEditingGame(game)
    setShowSchedule(true)
  }

  const handleDeleteClick = (gameId: string) => {
    setShowDeleteConfirm(gameId)
  }

  const handleDeleteConfirm = async () => {
    if (showDeleteConfirm) {
      await deleteGame(showDeleteConfirm)
      setShowDeleteConfirm(null)
    }
  }

  const handleScheduleClose = () => {
    setShowSchedule(false)
    setEditingGame(null)
  }

  const handleScheduleSubmitted = () => {
    setEditingGame(null)
    refreshGames()
  }

  const handleRsvp = async (gameId: string, playerId: string, status: 'yes' | 'no' | 'maybe') => {
    await upsertRsvp(gameId, playerId, status)
    refresh()
  }

  const handleRemoveRsvp = async (gameId: string, playerId: string) => {
    await deleteRsvp(gameId, playerId)
    refresh()
  }

  const upcomingGames = games
    .filter(g => new Date(g.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">PitchConnect</h1>
        <p className="text-gray-600">Schedule games & track who's coming</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8 justify-center">
        <button
          onClick={() => setShowSchedule(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule Game
        </button>
        <button
          onClick={() => setShowAddPlayer(true)}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Player
        </button>
      </div>

      {/* Upcoming Games */}
      <section className="mb-12">
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
              players={players}
              rsvps={rsvps}
              onRefresh={refreshGames}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onRsvp={handleRsvp}
              onDeleteRsvp={handleRemoveRsvp}
            />
            ))}
          </div>
        )}
      </section>

      {/* Players */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-red-500" />
          Players ({players.length})
        </h2>
        <PlayerList
          players={players}
          onRefresh={refreshPlayers}
          rsvps={rsvps}
        />
      </section>

      {/* Modals */}
      <ScheduleGameDialog
        open={showSchedule}
        onClose={handleScheduleClose}
        onSubmitted={handleScheduleSubmitted}
        editingGame={editingGame}
        createGame={createGame}
        updateGame={updateGame}
      />
      <Dialog
        open={!!showDeleteConfirm}
        onOpenChange={(open) => !open && setShowDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Game</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">Are you sure you want to delete this game? This action cannot be undone.</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(null)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm} 
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AddPlayerDialog
        open={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        onAdded={async () => {
          refreshPlayers()
          setShowAddPlayer(false)
        }}
        addPlayer={addPlayer}
        updatePlayer={updatePlayer}
      />
    </div>
  )
}
