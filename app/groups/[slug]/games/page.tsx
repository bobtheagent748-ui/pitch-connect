'use client'

import { useState, useEffect } from 'react'
import { useGroup } from '@/lib/group-context'
import { useGroups } from '@/hooks/use-groups'
import { useGames } from '@/hooks/use-games'
import { usePlayers } from '@/hooks/use-players'
import { useRsvps } from '@/hooks/use-rsvps'
import { GameCard } from '@/components/game-card'
import { PlayerList } from '@/components/player-list'
import { ScheduleGameDialog } from '@/components/schedule-game-dialog'
import { AddPlayerDialog } from '@/components/add-player-dialog'
import { useSession } from 'next-auth/react'
import { Plus, AlertCircle, Users2, Calendar, Trophy, ChevronDown, ChevronUp, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Tab = 'games' | 'players'

export default function GroupDashboardPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const { activeGroup, setActiveGroup } = useGroup()
  const { groups } = useGroups()
  const groupId = groups?.find(g => g.slug === slug)?.id || null
  const groupName = groups?.find(g => g.slug === slug)?.name || slug
  const { games, refreshGames, createGame, updateGame, deleteGame, error: gamesError } = useGames(groupId)
  const { players, refreshPlayers, addPlayer, updatePlayer, deletePlayer, error: playersError } = usePlayers(groupId)
  const { rsvps, upsertRsvp, deleteRsvp, refresh: refreshRsvps } = useRsvps(groupId)

  const [showSchedule, setShowSchedule] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [editingGame, setEditingGame] = useState<any>(null)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'game' | 'player', id: string} | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('games')
  const [showPastGames, setShowPastGames] = useState(false)
  const displayError = gamesError || playersError

  const { data: session } = useSession()
  const userEmail = session?.user?.email || ''
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleLeaveGroup = async () => {
    if (!userEmail || !groupId) return
    const supabase = (await import('@/lib/supabase/client')).createClient()
    // Find player record for this user in this group
    const { data: playerRecords } = await supabase
      .from('players')
      .select('id')
      .eq('league_id', groupId)
      .eq('email', userEmail)
    if (playerRecords && playerRecords.length > 0) {
      for (const p of playerRecords) {
        await supabase.from('players').delete().eq('id', p.id)
      }
      await refreshPlayers()
      await refreshGames()
      await refreshRsvps()
    }
  }

  // Sync active group to current URL slug on navigation
  useEffect(() => {
    setActiveGroup(slug)
  }, [slug, setActiveGroup])

  const handleEditGame = (game: any) => {
    setEditingGame(game)
    setShowSchedule(true)
  }

  const handleGameDeleteClick = (gameId: string) => {
    setShowDeleteConfirm({type: 'game', id: gameId})
  }

  const handleGameDeleteConfirm = async () => {
    if (!showDeleteConfirm || showDeleteConfirm.type !== 'game') return
    await deleteGame(showDeleteConfirm.id)
    setShowDeleteConfirm(null)
  }

  const handleEditPlayer = (player: any) => {
    setEditingPlayer(player)
    setShowAddPlayer(true)
  }

  const handlePlayerDeleteClick = (playerId: string) => {
    setShowDeleteConfirm({type: 'player', id: playerId})
  }

  const handlePlayerDeleteConfirm = async () => {
    if (!showDeleteConfirm || showDeleteConfirm.type !== 'player') return
    await deletePlayer(showDeleteConfirm.id)
    setShowDeleteConfirm(null)
  }

  const upcomingGames = games
    .filter(g => g.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))

  const pastGames = games
    .filter(g => g.date < todayStr)
    .sort((a, b) => b.date.localeCompare(a.date))

  const confirmedRsvps = rsvps.filter(r => r.status === 'yes').length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="w-6 h-6 text-red-500" />
            {groups?.find(g => g.slug === slug)?.name || slug}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === 'games' ? 'Manage games and RSVPs' : 'Manage players'}
          </p>
        </div>
        <button
          onClick={() => activeTab === 'games' ? setShowSchedule(true) : setShowAddPlayer(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'games' ? 'Schedule Game' : 'Add Player'}
        </button>
        {userEmail && (
          <button
            onClick={handleLeaveGroup}
            className="ml-2 text-gray-400 hover:text-red-500 text-sm p-2 rounded-lg hover:bg-red-50 transition"
            title="Leave this group"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{upcomingGames.length}</div>
          <div className="text-sm text-gray-600">Upcoming Games</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{players?.length || 0}</div>
          <div className="text-sm text-gray-600">Players</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{confirmedRsvps}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'games'
              ? 'bg-red-50 text-red-600 border-b-2 border-red-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-1" />
          Games
        </button>
        <button
          onClick={() => setActiveTab('players')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'players'
              ? 'bg-red-50 text-red-600 border-b-2 border-red-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Users2 className="w-4 h-4 inline mr-1" />
          Players
        </button>
      </div>

      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'games' && (
        <div className="space-y-3">
          {upcomingGames.length === 0 && pastGames.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-600 mb-2">No games yet</p>
              <button onClick={() => setShowSchedule(true)} className="text-red-500 hover:text-red-600 font-medium">Schedule your first game →</button>
            </div>
          ) : (
            <>
              {upcomingGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  players={players || []}
                  rsvps={rsvps || []}
                  onRefresh={refreshGames}
                  onEdit={handleEditGame}
                  onDelete={handleGameDeleteClick}
                  onRsvp={async (gameId, playerId, status) => {
                    await upsertRsvp(gameId, playerId, status)
                    await refreshRsvps()
                  }}
                  onDeleteRsvp={async (gameId, playerId) => {
                    await deleteRsvp(gameId, playerId)
                    await refreshRsvps()
                  }}
                  groupId={groupId}
                  userEmail={userEmail}
                />
              ))}

              {pastGames.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowPastGames(!showPastGames)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-3"
                  >
                    {showPastGames ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Past Games ({pastGames.length})
                  </button>
                  {showPastGames && (
                    <div className="space-y-3 opacity-75">
                      {pastGames.map(game => (
                        <GameCard
                          key={game.id}
                          game={game}
                          players={players || []}
                          rsvps={rsvps || []}
                          onRefresh={refreshGames}
                          onEdit={handleEditGame}
                          onDelete={handleGameDeleteClick}
                          onRsvp={async (gameId, playerId, status) => {
                            await upsertRsvp(gameId, playerId, status)
                            await refreshRsvps()
                          }}
                          onDeleteRsvp={async (gameId, playerId) => {
                            await deleteRsvp(gameId, playerId)
                            await refreshRsvps()
                          }}
                          groupId={groupId}
                          userEmail={userEmail}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Players Tab */}
      {activeTab === 'players' && (
        <PlayerList
          players={players || []}
          rsvps={rsvps || []}
          onRefresh={refreshPlayers}
          onEdit={handleEditPlayer}
          onDelete={handlePlayerDeleteClick}
        />
      )}

      {/* Modals */}
      <ScheduleGameDialog
        open={showSchedule}
        onClose={() => { setShowSchedule(false); setEditingGame(null) }}
        onSubmitted={() => { setEditingGame(null); refreshGames() }}
        editingGame={editingGame}
        createGame={createGame}
        updateGame={updateGame}
        groupId={groupId}
      />

      {showDeleteConfirm && showDeleteConfirm.type === 'game' && (
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>Delete Game</DialogTitle></DialogHeader>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this game?</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1">Cancel</Button>
              <Button variant="destructive" onClick={handleGameDeleteConfirm} className="flex-1">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showDeleteConfirm && showDeleteConfirm.type === 'player' && (
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>Delete Player</DialogTitle></DialogHeader>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this player?</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1">Cancel</Button>
              <Button variant="destructive" onClick={handlePlayerDeleteConfirm} className="flex-1">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAddPlayer && (
        <AddPlayerDialog
          open={showAddPlayer}
          onClose={() => { setShowAddPlayer(false); setEditingPlayer(null) }}
          onAdded={async (playerData: any) => {
            setShowAddPlayer(false)
            setEditingPlayer(null)
            await refreshPlayers()
            // Send invite email
            if (playerData?.email) {
              fetch('/api/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: playerData.email, groupName, type: 'invited' }),
              }).catch(() => {})
            }
          }}
          addPlayer={addPlayer}
          updatePlayer={updatePlayer}
          editingPlayer={editingPlayer}
        />
      )}
    </div>
  )
}
