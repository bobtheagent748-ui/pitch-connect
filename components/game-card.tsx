'use client';

import { Calendar, MapPin, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface GameCardProps {
  game: any;
  players: any[];
  rsvps: any[];
  onRefresh: () => void;
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

  const whatsmyStatus = (playerId: string) => {
    const r = rsvpList?.find(r => r.player_id === playerId);
    return r?.status;
  };

  const handleStatus = async (status: 'yes' | 'no' | 'maybe') => {
    if (!selectedPlayer) return;
    if (onRsvp) {
      await onRsvp(game.id, selectedPlayer, status);
    }
  };

  const whatsappMessage = encodeURIComponent(
    'Game at ' + game.field_name + '!\n' +
    format(gameDate, 'MMM d, yyyy') + '\n' +
    game.time + '\n' +
    (game.full_address || 'Location TBD')
  );
  const whatsappUrl = 'https://wa.me/?text=' + whatsappMessage;

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {game.field_name || game.full_address || 'Game'}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(gameDate, 'EEE, MMM d')}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {game.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {game.full_address || game.field_name || 'Field TBD'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
            {yesCount} yes · {noCount} no · {maybeCount} maybe
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Inline RSVP Section */}
      <div className="flex items-center gap-2 mt-2">
        {/* Player selector */}
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-gray-50 min-w-[100px]"
        >
          <option value="">Who are you?</option>
          {players?.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Status buttons */}
        <button
          onClick={() => handleStatus('yes')}
          disabled={!selectedPlayer}
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition ${
            yesCount > 0
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : selectedPlayer
                ? 'border border-green-300 text-green-600 hover:bg-green-50'
                : 'border border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          Yes
        </button>
        <button
          onClick={() => handleStatus('maybe')}
          disabled={!selectedPlayer}
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition ${
            maybeCount > 0
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : selectedPlayer
                ? 'border border-yellow-300 text-yellow-600 hover:bg-yellow-50'
                : 'border border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
        >
          <HelpCircle className="w-3 h-3" />
          Maybe
        </button>
        <button
          onClick={() => handleStatus('no')}
          disabled={!selectedPlayer}
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition ${
            noCount > 0
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : selectedPlayer
                ? 'border border-red-300 text-red-600 hover:bg-red-50'
                : 'border border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
        >
          <XCircle className="w-3 h-3" />
          No
        </button>
        <button
          onClick={() => onDeleteRsvp?.(game.id, selectedPlayer)}
          disabled={!selectedPlayer}
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border transition ${
            selectedPlayer
              ? 'border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
        >
          <X className="w-3 h-3" />
          Remove
        </button>
      </div>

      {/* WhatsApp Share */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium mt-2"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.884 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Share to WhatsApp
      </a>

      {/* Action Buttons */}
      {(onDelete || onEdit) && (
        <div className="mt-2 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(game)}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-600 text-xs font-medium"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(game.id)}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-red-600 text-xs font-medium"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          )}
        </div>
      )}

      {/* Expanded RSVP List */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 mb-2">RSVP STATUS:</h4>
          <div className="grid grid-cols-3 gap-2">
            {/* Yes */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-600">Yes ({yesCount})</span>
              </div>
              <div className="space-y-0.5">
                {rsvpList && rsvpList.filter((r: any) => r.status === 'yes').map((rsvp: any) => {
                  const player = players && players.find((p: any) => p.id === rsvp.player_id);
                  return (
                    <div key={rsvp.id} className="text-xs text-green-600 pl-3">
                      {player ? player.name : 'Player'}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Maybe */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-600">Maybe ({maybeCount})</span>
              </div>
              <div className="space-y-0.5">
                {rsvpList && rsvpList.filter((r: any) => r.status === 'maybe').map((rsvp: any) => {
                  const player = players && players.find((p: any) => p.id === rsvp.player_id);
                  return (
                    <div key={rsvp.id} className="text-xs text-yellow-700 pl-3">
                      {player ? player.name : 'Player'}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* No */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="text-gray-600">No ({noCount})</span>
              </div>
              <div className="space-y-0.5">
                {rsvpList && rsvpList.filter((r: any) => r.status === 'no').map((rsvp: any) => {
                  const player = players && players.find((p: any) => p.id === rsvp.player_id);
                  return (
                    <div key={rsvp.id} className="text-xs text-gray-400 pl-3">
                      {player ? player.name : 'Player'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons for Status buttons
function CheckCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function HelpCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
    </svg>
  );
}

function XCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function X({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
