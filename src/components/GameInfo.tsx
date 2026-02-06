import { Crown, RotateCcw, Flag, Home } from 'lucide-react';
import { GameState, Piece, PieceType } from '../types/chess';
import ChessPiece from './ChessPiece';

interface GameInfoProps {
  gameState: GameState;
  onRestart: () => void;
  onHome: () => void;
}

const PIECE_ORDER: PieceType[] = ['queen', 'rook', 'bishop', 'knight', 'pawn'];

function sortCaptured(pieces: Piece[]): Piece[] {
  return [...pieces].sort((a, b) => PIECE_ORDER.indexOf(a.type) - PIECE_ORDER.indexOf(b.type));
}

function getMaterialAdvantage(captured: { white: Piece[]; black: Piece[] }): { white: number; black: number } {
  const values: Record<PieceType, number> = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
  const whiteCaptured = captured.black.reduce((sum, p) => sum + values[p.type], 0);
  const blackCaptured = captured.white.reduce((sum, p) => sum + values[p.type], 0);
  return {
    white: Math.max(0, whiteCaptured - blackCaptured),
    black: Math.max(0, blackCaptured - whiteCaptured),
  };
}

export default function GameInfo({ gameState, onRestart, onHome }: GameInfoProps) {
  const { status, currentTurn, playerColor, capturedPieces, difficulty, isThinking } = gameState;
  const botColor = playerColor === 'white' ? 'black' : 'white';
  const advantage = getMaterialAdvantage(capturedPieces);

  const diffLabels = { easy: 'Новичок', medium: 'Любитель', hard: 'Мастер' };

  const getStatusText = () => {
    switch (status) {
      case 'checkmate':
        return currentTurn === playerColor ? '💀 Мат! Вы проиграли' : '🏆 Мат! Вы победили!';
      case 'stalemate':
        return '🤝 Пат! Ничья';
      case 'draw':
        return '🤝 Ничья';
      case 'check':
        return currentTurn === playerColor ? '⚠️ Вам шах!' : '⚡ Шах боту!';
      default:
        return currentTurn === playerColor ? '🎯 Ваш ход' : '🤖 Ход бота...';
    }
  };

  const getStatusColor = () => {
    if (status === 'checkmate') {
      return currentTurn === playerColor ? 'text-red-400' : 'text-emerald-400';
    }
    if (status === 'check') return 'text-amber-400';
    if (status === 'stalemate' || status === 'draw') return 'text-gray-400';
    return currentTurn === playerColor ? 'text-primary-400' : 'text-gray-400';
  };

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary-600/20 text-primary-400 font-medium">
            {diffLabels[difficulty]}
          </span>
        </div>
        <p className={`text-lg font-bold ${getStatusColor()} ${isThinking ? 'animate-thinking' : ''}`}>
          {getStatusText()}
        </p>
      </div>

      {/* Players */}
      <div className="glass rounded-2xl p-5 space-y-4">
        {/* Bot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
              botColor === 'white' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white border border-gray-700'
            }`}>
              {botColor === 'white' ? '♔' : '♚'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300">Бот</p>
              <p className="text-xs text-gray-500">{diffLabels[difficulty]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {sortCaptured(botColor === 'white' ? capturedPieces.black : capturedPieces.white).map((p, i) => (
              <span key={i} className="text-sm opacity-70">
                <ChessPiece type={p.type} color={p.color} size={16} />
              </span>
            ))}
            {advantage[botColor] > 0 && (
              <span className="text-xs text-gray-500 ml-1">+{advantage[botColor]}</span>
            )}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Player */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
              playerColor === 'white' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white border border-gray-700'
            }`}>
              {playerColor === 'white' ? '♔' : '♚'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Вы</p>
              <p className="text-xs text-gray-500">{playerColor === 'white' ? 'Белые' : 'Чёрные'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {sortCaptured(playerColor === 'white' ? capturedPieces.black : capturedPieces.white).map((p, i) => (
              <span key={i} className="text-sm opacity-70">
                <ChessPiece type={p.type} color={p.color} size={16} />
              </span>
            ))}
            {advantage[playerColor] > 0 && (
              <span className="text-xs text-gray-500 ml-1">+{advantage[playerColor]}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass hover:bg-white/[0.06] transition-all text-sm font-medium text-gray-300 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
          Заново
        </button>
        <button
          onClick={onHome}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass hover:bg-white/[0.06] transition-all text-sm font-medium text-gray-300 hover:text-white"
        >
          <Home className="w-4 h-4" />
          Меню
        </button>
      </div>
    </div>
  );
}