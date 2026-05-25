// This is the main game page that displays all games
// It shows upcoming games with RSVP status
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useGames } from '@/hooks/use-games'
import { useRsvps } from '@/hooks/use-rsvps'
import { GameCard } from '@/components/game-card'
import { ScheduleGameDialog } from '@/components/schedule-game-dialog'
import { Plus, AlertCircle, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function GamesPage() {
  const { games, refreshGames, loading, error, createGame, updateGame, deleteGame } = useGames()
  const { rsvps } = useRsvps()
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [editingGame, setEditingGame] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleAddClick = () => {
    setEditingGame(null)
    setShowScheduleDialog(true)
  }

  const handleEdit = (game: any) => {
    setEditingGame(game)
    setShowScheduleDialog(true)
  }

  const handleDeleteClick = (gameId: string) => {
    setShowDeleteConfirm(gameId)
  }

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return
    await deleteGame(showDeleteConfirm)
    setShowDeleteConfirm(null)
  }

  const handleDialogClose = () => {
    setShowScheduleDialog(false)
    setEditingGame(null)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">← Back</Link>
          <h1 className="text-2xl font-bold">Games</h1>
        </div>
        <p className="text-gray-600">Loading games...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">← Back</Link>
          <h1 className="text-2xl font-bold">Games</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          <p className="font-medium">Failed to load games</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-gray-600 hover:text-gray-900">← Back</Link>
        <h1 className="text-2xl font-bold">Games</h1>
        <button
          onClick={handleAddClick}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Game
        </button>
      </div>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'upcoming' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'past' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Past
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          All
        </button>
      </div>

      {games.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">No games yet</p>
          <button
            onClick={handleAddClick}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Schedule your first game →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {games
            .filter(game => {
              const gameDate = new Date(game.date)
              const now = new Date()
              if (filter === 'upcoming') return gameDate >= now
              if (filter === 'past') return gameDate < now
              return true
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(game => (
              <GameCard
                key={game.id}
                game={game}
                players={[]}
                rsvps={rsvps}
                onRefresh={refreshGames}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          }
        </div>
      )}

      {/* Schedule/Edit Game Dialog */}
      <ScheduleGameDialog
        open={showScheduleDialog}
        onClose={handleDialogClose}
        onSubmitted={refreshGames}
        editingGame={editingGame}
        createGame={createGame}
        updateGame={updateGame}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Game</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this game?</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} className="flex-1">
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
