import { Board, Piece, PieceColor, PieceType, Position, Move, GameState, Difficulty, GameStatus, GameMode } from '../../types/chess';
import { deepCopyBoard, getValidMoves, getAllValidMoves, isInCheck, getMoveNotation } from './moves';

export function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRow[c], color: 'black', hasMoved: false };
    board[1][c] = { type: 'pawn', color: 'black', hasMoved: false };
    board[6][c] = { type: 'pawn', color: 'white', hasMoved: false };
    board[7][c] = { type: backRow[c], color: 'white', hasMoved: false };
  }

  return board;
}

export function createInitialGameState(
  gameMode: GameMode = 'bot',
  playerColor: PieceColor = 'white',
  difficulty: Difficulty = 'medium'
): GameState {
  return {
    board: createInitialBoard(),
    currentTurn: 'white',
    status: 'playing',
    moveHistory: [],
    selectedSquare: null,
    validMoves: [],
    capturedPieces: { white: [], black: [] },
    gameMode,
    playerColor,
    difficulty,
    enPassantTarget: null,
    isThinking: false,
  };
}

export function makeMove(state: GameState, from: Position, to: Position): GameState {
  const board = deepCopyBoard(state.board);
  const piece = board[from.row][from.col];
  if (!piece) return state;

  const captured = board[to.row][to.col];
  let isEnPassant = false;
  let isCastling = false;
  let enPassantTarget: Position | null = null;

  // En passant capture
  if (piece.type === 'pawn' && state.enPassantTarget &&
      to.row === state.enPassantTarget.row && to.col === state.enPassantTarget.col) {
    isEnPassant = true;
    board[from.row][to.col] = null;
  }

  // Castling
  if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
    isCastling = true;
    if (to.col === 6) {
      board[from.row][5] = board[from.row][7];
      board[from.row][7] = null;
      if (board[from.row][5]) board[from.row][5]!.hasMoved = true;
    } else if (to.col === 2) {
      board[from.row][3] = board[from.row][0];
      board[from.row][0] = null;
      if (board[from.row][3]) board[from.row][3]!.hasMoved = true;
    }
  }

  // En passant target for next move
  if (piece.type === 'pawn' && Math.abs(to.row - from.row) === 2) {
    enPassantTarget = { row: (from.row + to.row) / 2, col: from.col };
  }

  // Promotion
  let isPromotion = false;
  if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    isPromotion = true;
    piece.type = 'queen';
  }

  board[to.row][to.col] = { ...piece, hasMoved: true };
  board[from.row][from.col] = null;

  const capturedPiece = isEnPassant
    ? { type: 'pawn' as PieceType, color: (piece.color === 'white' ? 'black' : 'white') as PieceColor }
    : captured;

  const newCaptured = { ...state.capturedPieces };
  if (capturedPiece) {
    if (capturedPiece.color === 'white') {
      newCaptured.white = [...newCaptured.white, capturedPiece];
    } else {
      newCaptured.black = [...newCaptured.black, capturedPiece];
    }
  }

  const notation = getMoveNotation(state.board, from, to, piece, captured, isCastling, isPromotion);

  const move: Move = {
    from,
    to,
    piece: { ...piece },
    captured: capturedPiece || undefined,
    isCastling,
    isEnPassant,
    notation,
  };

  const nextTurn: PieceColor = state.currentTurn === 'white' ? 'black' : 'white';

  // Check game status
  const opponentMoves = getAllValidMoves(board, nextTurn, enPassantTarget);
  const inCheck = isInCheck(board, nextTurn);
  let status: GameStatus = 'playing';

  if (opponentMoves.length === 0) {
    status = inCheck ? 'checkmate' : 'stalemate';
  } else if (inCheck) {
    status = 'check';
    move.notation = (move.notation || '') + '+';
  }

  if (status === 'checkmate') {
    move.notation = (move.notation || '').replace('+', '') + '#';
  }

  return {
    ...state,
    board,
    currentTurn: nextTurn,
    status,
    moveHistory: [...state.moveHistory, move],
    selectedSquare: null,
    validMoves: [],
    capturedPieces: newCaptured,
    enPassantTarget: enPassantTarget,
    isThinking: false,
  };
}