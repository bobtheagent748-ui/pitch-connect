'use client'

import { PlayerList } from '@/components/player-list'
import { AddPlayerDialog } from '@/components/add-player-dialog'
import { usePlayers } from '@/hooks/use-players'
import { useRsvps } from '@/hooks/use-rsvps'
import { useState } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function PlayersPage() {
  const { players, loading, error, refreshPlayers, deletePlayer, addPlayer, updatePlayer } = usePlayers()
  const { rsvps } = useRsvps()
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleEdit = (player: any) => {
    setEditingPlayer({...player})
    setShowAddPlayer(false)
  }

  const handleDeleteClick = (playerId: string) => {
    setShowDeleteConfirm(playerId)
  }

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return
    await deletePlayer(showDeleteConfirm)
    setShowDeleteConfirm(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Players</h1>
        <button
          onClick={() => setShowAddPlayer(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Player
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading players...</p>
      ) : (
        <PlayerList
          players={players || []}
          rsvps={rsvps || []}
          onRefresh={refreshPlayers}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <AddPlayerDialog
        open={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        onAdded={async () => {
          console.log('[PlayersPage] onAdded triggered')
          setShowAddPlayer(false)
          await refreshPlayers()
        }}
        addPlayer={addPlayer}
        updatePlayer={updatePlayer}
      />

      {showDeleteConfirm && (
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Player</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this player?</p>
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

      {editingPlayer && (
        <AddPlayerDialog
          open={!!editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onAdded={async () => {
            setEditingPlayer(null)
            await refreshPlayers()
          }}
          editingPlayer={editingPlayer}
          addPlayer={addPlayer}
          updatePlayer={updatePlayer}
        />
      )}
    </div>
  )
}
