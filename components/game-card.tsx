'use client';

import { Calendar, MapPin, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface GameCardProps {
  game: any;
  players: any[];
  rsvps: any[];
  onRefresh: () => void;
  groupId?: string | null;
  onDelete?: (gameId: string) => void;
  onEdit?: (game: any) => void;
  onRsvp?: (gameId: string, playerId: string, status: 'yes' | 'no' | 'maybe') => void;
  onDeleteRsvp?: (gameId: string, playerId: string) => void;
}

export function GameCard({ game, players, rsvps, onRefresh, onDelete, onEdit, onRsvp, onDeleteRsvp }: GameCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const gameDate = new Date(game.date);
  const rsvpList = rsvps ? rsvps.filter((r: any) => r.game_id === game.id) : [];
  const yesCount = rsvpList ? rsvpList.filter((r: any) => r.status === 'yes').length : 0;
  const noCount = rsvpList ? rsvpList.filter((r: any) => r.status === 'no').length : 0;
  const maybeCount = rsvpList ? rsvpList.filter((r: any) => r.status === 'maybe').length : 0;
  const totalRsvps = yesCount + noCount + maybeCount;
  const totalPlayers = players?.length || 0;
  const pct = totalPlayers > 0 ? Math.round((totalRsvps / totalPlayers) * 100) : 0;

  const handleStatus = async (status: 'yes' | 'no' | 'maybe') => {
    if (!selectedPlayer) return;
    if (onRsvp) {
      await onRsvp(game.id, selectedPlayer, status);
    }
  };

  const whatsappMessage = encodeURIComponent(
    '⚽ Game at ' + game.field_name + '!\n' +
    format(gameDate, 'EEEE, MMMM d, yyyy') + '\n' +
    game.time + '\n' +
    (game.full_address || '📍 Location TBD')
  );
  const whatsappUrl = 'https://wa.me/?text=' + whatsappMessage;

  return (
    <div className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />

      <div className="p-4">
        {/* Header: Date + Field */}
        <div className="flex items-start gap-3">
          {/* Date block */}
          <div className="shrink-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              {format(gameDate, 'MMM').toUpperCase()}
            </div>
            <div className="text-xl font-bold text-gray-900 leading-none">
              {format(gameDate, 'd')}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              {format(gameDate, 'EEE')}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{game.field_name || game.full_address || 'Game'}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {game.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{game.full_address || game.field_name || 'Field TBD'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* RSVP bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">
              RSVPs: <span className="font-semibold text-gray-700">{totalRsvps}/{totalPlayers}</span>
            </span>
            {pct > 0 && (
              <span className={`font-medium ${pct >= 100 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-gray-400'}`}>
                {pct}% replied
              </span>
            )}
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
            {yesCount > 0 && (
              <div
                className="bg-green-500 transition-all duration-300"
                style={{ width: `${totalRsvps > 0 ? (yesCount / totalRsvps) * 100 : 0}%` }}
              />
            )}
            {maybeCount > 0 && (
              <div
                className="bg-amber-400 transition-all duration-300"
                style={{ width: `${totalRsvps > 0 ? (maybeCount / totalRsvps) * 100 : 0}%` }}
              />
            )}
            {noCount > 0 && (
              <div
                className="bg-red-400 transition-all duration-300"
                style={{ width: `${totalRsvps > 0 ? (noCount / totalRsvps) * 100 : 0}%` }}
              />
            )}
          </div>
          <div className="flex gap-3 mt-1.5 text-[10px] text-gray-400">
            {yesCount > 0 && <span className="text-green-600 font-medium">● {yesCount} yes</span>}
            {maybeCount > 0 && <span className="text-amber-600 font-medium">● {maybeCount} maybe</span>}
            {noCount > 0 && <span className="text-red-500 font-medium">● {noCount} no</span>}
          </div>
        </div>

        {/* Inline RSVP controls */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-gray-50 w-28"
          >
            <option value="">Who are you?</option>
            {players?.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => handleStatus('yes')}
            disabled={!selectedPlayer}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition ${
              selectedPlayer
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleStatus('maybe')}
            disabled={!selectedPlayer}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition ${
              selectedPlayer
                ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
            }`}
          >
            Maybe
          </button>
          <button
            onClick={() => handleStatus('no')}
            disabled={!selectedPlayer}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition ${
              selectedPlayer
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
            }`}
          >
            No
          </button>

          {selectedPlayer && (
            <button
              onClick={() => onDeleteRsvp?.(game.id, selectedPlayer)}
              className="text-gray-400 hover:text-red-500 transition"
              title="Remove your RSVP"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Action buttons + Share */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.884 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Share
            </a>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(game)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(game.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded RSVP list */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] font-semibold text-green-600 uppercase tracking-wider mb-1">
                  Yes ({yesCount})
                </div>
                <div className="space-y-0.5">
                  {rsvpList?.filter((r: any) => r.status === 'yes').map((rsvp: any) => {
                    const player = players?.find((p: any) => p.id === rsvp.player_id);
                    return (
                      <div key={rsvp.id} className="text-xs text-gray-600 pl-2 border-l-2 border-green-400">
                        {player ? player.name : 'Player'}
                      </div>
                    );
                  })}
                  {yesCount === 0 && <div className="text-[10px] text-gray-300 italic pl-2">No responses yet</div>}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
                  Maybe ({maybeCount})
                </div>
                <div className="space-y-0.5">
                  {rsvpList?.filter((r: any) => r.status === 'maybe').map((rsvp: any) => {
                    const player = players?.find((p: any) => p.id === rsvp.player_id);
                    return (
                      <div key={rsvp.id} className="text-xs text-gray-600 pl-2 border-l-2 border-amber-400">
                        {player ? player.name : 'Player'}
                      </div>
                    );
                  })}
                  {maybeCount === 0 && <div className="text-[10px] text-gray-300 italic pl-2">No responses yet</div>}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-1">
                  No ({noCount})
                </div>
                <div className="space-y-0.5">
                  {rsvpList?.filter((r: any) => r.status === 'no').map((rsvp: any) => {
                    const player = players?.find((p: any) => p.id === rsvp.player_id);
                    return (
                      <div key={rsvp.id} className="text-xs text-gray-600 pl-2 border-l-2 border-red-400">
                        {player ? player.name : 'Player'}
                      </div>
                    );
                  })}
                  {noCount === 0 && <div className="text-[10px] text-gray-300 italic pl-2">No responses yet</div>}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
