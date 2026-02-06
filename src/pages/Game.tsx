import { useState, useCallback } from 'react';
import { Difficulty, PieceColor, GameState, GameMode } from '../types/chess';
import { createInitialGameState } from '../lib/chess/game';
import ChessBoard from '../components/ChessBoard';
import GameInfo from '../components/GameInfo';
import MoveHistory from '../components/MoveHistory';

interface GameProps {
  onNavigate: (page: string) => void;
  gameMode: GameMode;
  difficulty: Difficulty;
  playerColor: PieceColor;
}

export default function Game({ onNavigate, gameMode, difficulty, playerColor }: GameProps) {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(gameMode, playerColor, difficulty)
  );

  const handleRestart = useCallback(() => {
    setGameState(createInitialGameState(gameMode, playerColor, difficulty));
  }, [gameMode, playerColor, difficulty]);

  const handleHome = useCallback(() => {
    onNavigate('home');
  }, [onNavigate]);

  const getGameOverTitle = () => {
    if (gameState.status === 'stalemate') return 'Пат! Ничья';
    
    if (gameMode === 'pvp') {
      const winner = gameState.currentTurn === 'white' ? 'Чёрные' : 'Белые';
      return `Мат! Победили ${winner}!`;
    }
    
    return gameState.currentTurn === playerColor ? 'Мат! Вы проиграли' : 'Мат! Вы победили!';
  };

  const getGameOverEmoji = () => {
    if (gameState.status === 'stalemate') return '🤝';
    if (gameMode === 'pvp') return '🏆';
    return gameState.currentTurn === playerColor ? '💀' : '🏆';
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Game Over Overlay */}
        {(gameState.status === 'checkmate' || gameState.status === 'stalemate') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-slide-up">
              <div className="text-6xl mb-4">{getGameOverEmoji()}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{getGameOverTitle()}</h2>
              <p className="text-gray-400 mb-6">
                {gameState.status === 'checkmate' && gameMode === 'bot' && gameState.currentTurn !== playerColor
                  ? 'Отличная игра! Бот повержен.'
                  : gameState.status === 'checkmate' && gameMode === 'bot'
                  ? 'Попробуйте ещё раз или смените сложность.'
                  : gameState.status === 'checkmate'
                  ? 'Отличная партия!'
                  : 'Ни одна сторона не может сделать ход.'}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Всего ходов: {gameState.moveHistory.length}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all shadow-lg shadow-primary-500/20"
                >
                  Играть ещё
                </button>
                <button
                  onClick={handleHome}
                  className="flex-1 py-3 px-6 rounded-xl glass hover:bg-white/[0.06] text-gray-300 font-semibold transition-all"
                >
                  Меню
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Board */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
            <ChessBoard gameState={gameState} setGameState={setGameState} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-4">
            <GameInfo
              gameState={gameState}
              onRestart={handleRestart}
              onHome={handleHome}
            />
            <MoveHistory moves={gameState.moveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}