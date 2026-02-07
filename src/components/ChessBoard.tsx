import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, PieceColor, Difficulty } from '../types/chess';
import { getValidMoves, isInCheck, findKing } from '../lib/chess/moves';
import { createInitialGameState, makeMove } from '../lib/chess/game';
import { getBotMove } from '../lib/chess/bot';
import ChessPiece from './ChessPiece';

interface ChessBoardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function ChessBoard({ gameState, setGameState }: ChessBoardProps) {
  const { board, currentTurn, playerColor, selectedSquare, validMoves, status, moveHistory, enPassantTarget, gameMode } = gameState;

  const isFlipped = playerColor === 'black';
  const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
  const kingInCheck = (status === 'check' || status === 'checkmate') ? findKing(board, currentTurn) : null;

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (status === 'checkmate' || status === 'stalemate' || status === 'draw') return;
    if (currentTurn !== playerColor) return;
    if (gameState.isThinking) return;

    const clickedPiece = board[row][col];

    if (selectedSquare) {
      // Try to move to clicked square
      const isValidMove = validMoves.some(m => m.row === row && m.col === col);

      if (isValidMove) {
        const newState = makeMove(gameState, selectedSquare, { row, col });
        setGameState(newState);
        return;
      }

      // Click on own piece - reselect
      if (clickedPiece && clickedPiece.color === playerColor) {
        const moves = getValidMoves(board, { row, col }, enPassantTarget);
        setGameState(prev => ({
          ...prev,
          selectedSquare: { row, col },
          validMoves: moves,
        }));
        return;
      }

      // Deselect
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: [],
      }));
      return;
    }

    // Select own piece
    if (clickedPiece && clickedPiece.color === playerColor) {
      const moves = getValidMoves(board, { row, col }, enPassantTarget);
      setGameState(prev => ({
        ...prev,
        selectedSquare: { row, col },
        validMoves: moves,
      }));
    }
  }, [board, currentTurn, playerColor, selectedSquare, validMoves, status, gameState, enPassantTarget, setGameState]);

  // Bot move
  useEffect(() => {
    // Only run if game mode is bot
    if (gameMode !== 'bot') return;
    
    // Check if it's bot's turn and game is active
    const isBotTurn = currentTurn !== playerColor;
    const isGameActive = status === 'playing' || status === 'check';
    
    if (isBotTurn && isGameActive && !gameState.isThinking) {
      setGameState(prev => ({ ...prev, isThinking: true }));

      const timer = setTimeout(() => {
        const botMove = getBotMove(board, currentTurn, gameState.difficulty, enPassantTarget);
        if (botMove) {
          setGameState(prev => {
            const newState = makeMove(prev, botMove.from, botMove.to);
            return { ...newState, isThinking: false };
          });
        } else {
          setGameState(prev => ({ ...prev, isThinking: false }));
        }
      }, 400 + Math.random() * 600);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, playerColor, status, board, enPassantTarget, gameState.difficulty, gameState.isThinking, gameMode, setGameState]);

  const getSquareColor = (row: number, col: number): string => {
    const isLight = (row + col) % 2 === 0;

    // Check highlight
    if (kingInCheck && kingInCheck.row === row && kingInCheck.col === col) {
      return 'bg-red-500/80';
    }

    // Selected square
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
      return 'bg-yellow-500/60';
    }

    // Last move
    if (lastMove) {
      if ((lastMove.from.row === row && lastMove.from.col === col) ||
          (lastMove.to.row === row && lastMove.to.col === col)) {
        return isLight ? 'bg-[#cdd26a]' : 'bg-[#aaa23a]';
      }
    }

    return isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
  };

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    const isValid = validMoves.some(m => m.row === row && m.col === col);
    const isCapture = isValid && piece !== null;
    const colLabels = 'abcdefgh';

    return (
      <div
        key={`${row}-${col}`}
        className={`relative flex items-center justify-center cursor-pointer transition-colors duration-100 ${getSquareColor(row, col)}`}
        onClick={() => handleSquareClick(row, col)}
        style={{ aspectRatio: '1' }}
      >
        {/* Coordinate labels */}
        {col === (isFlipped ? 7 : 0) && (
          <span className={`absolute top-0.5 left-1 text-[10px] font-bold select-none ${(row + col) % 2 === 0 ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>
            {8 - row}
          </span>
        )}
        {row === (isFlipped ? 0 : 7) && (
          <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold select-none ${(row + col) % 2 === 0 ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>
            {colLabels[col]}
          </span>
        )}

        {/* Valid move indicator */}
        {isValid && !isCapture && (
          <div className="absolute w-[28%] h-[28%] rounded-full bg-black/20" />
        )}

        {/* Capture indicator */}
        {isCapture && (
          <div className="absolute inset-[6%] rounded-full border-[4px] border-black/20" />
        )}

        {/* Piece */}
        {piece && (
          <div className="z-10">
            <ChessPiece type={piece.type} color={piece.color} size={38} />
          </div>
        )}
      </div>
    );
  };

  const rows = isFlipped ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="relative">
      {/* Thinking overlay */}
      {gameState.isThinking && (
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-center z-20">
          <div className="px-4 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 backdrop-blur-sm">
            <span className="text-sm text-primary-300 animate-thinking">Бот думает...</span>
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-8 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
        style={{ maxWidth: '560px', width: '100%' }}
      >
        {rows.map(row =>
          cols.map(col => renderSquare(row, col))
        )}
      </div>
    </div>
  );
}