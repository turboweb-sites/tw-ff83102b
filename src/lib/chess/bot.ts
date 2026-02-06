import { Board, PieceColor, PieceType, Position, Difficulty } from '../../types/chess';
import { deepCopyBoard, getAllValidMoves, isInCheck, getValidMoves } from './moves';

const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_TABLE_MID = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

function getPieceSquareValue(type: PieceType, row: number, col: number, color: PieceColor): number {
  const r = color === 'white' ? row : 7 - row;
  const tables: Record<PieceType, number[][]> = {
    pawn: PAWN_TABLE,
    knight: KNIGHT_TABLE,
    bishop: BISHOP_TABLE,
    rook: ROOK_TABLE,
    queen: QUEEN_TABLE,
    king: KING_TABLE_MID,
  };
  return tables[type][r][col];
}

function evaluateBoard(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] + getPieceSquareValue(piece.type, r, c, piece.color);
        score += piece.color === 'white' ? val : -val;
      }
    }
  }
  return score;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  color: PieceColor,
  enPassantTarget: Position | null
): number {
  if (depth === 0) {
    return evaluateBoard(board);
  }

  const currentColor: PieceColor = isMaximizing ? 'white' : 'black';
  const moves = getAllValidMoves(board, currentColor, enPassantTarget);

  if (moves.length === 0) {
    if (isInCheck(board, currentColor)) {
      return isMaximizing ? -99999 + (3 - depth) : 99999 - (3 - depth);
    }
    return 0;
  }

  // Order moves: captures first for better pruning
  moves.sort((a, b) => {
    const capA = board[a.to.row][a.to.col] ? 1 : 0;
    const capB = board[b.to.row][b.to.col] ? 1 : 0;
    return capB - capA;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = deepCopyBoard(board);
      const piece = newBoard[move.from.row][move.from.col];

      // Handle en passant
      if (piece && piece.type === 'pawn' && enPassantTarget &&
          move.to.row === enPassantTarget.row && move.to.col === enPassantTarget.col) {
        newBoard[move.from.row][move.to.col] = null;
      }

      newBoard[move.to.row][move.to.col] = piece ? { ...piece, hasMoved: true } : null;
      newBoard[move.from.row][move.from.col] = null;

      // Promotion
      if (piece && piece.type === 'pawn' && (move.to.row === 0 || move.to.row === 7)) {
        newBoard[move.to.row][move.to.col] = { type: 'queen', color: piece.color, hasMoved: true };
      }

      // Castling
      if (piece && piece.type === 'king' && Math.abs(move.to.col - move.from.col) === 2) {
        if (move.to.col === 6) {
          newBoard[move.from.row][5] = newBoard[move.from.row][7];
          newBoard[move.from.row][7] = null;
        } else {
          newBoard[move.from.row][3] = newBoard[move.from.row][0];
          newBoard[move.from.row][0] = null;
        }
      }

      let newEP: Position | null = null;
      if (piece && piece.type === 'pawn' && Math.abs(move.to.row - move.from.row) === 2) {
        newEP = { row: (move.from.row + move.to.row) / 2, col: move.from.col };
      }

      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, color, newEP);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = deepCopyBoard(board);
      const piece = newBoard[move.from.row][move.from.col];

      if (piece && piece.type === 'pawn' && enPassantTarget &&
          move.to.row === enPassantTarget.row && move.to.col === enPassantTarget.col) {
        newBoard[move.from.row][move.to.col] = null;
      }

      newBoard[move.to.row][move.to.col] = piece ? { ...piece, hasMoved: true } : null;
      newBoard[move.from.row][move.from.col] = null;

      if (piece && piece.type === 'pawn' && (move.to.row === 0 || move.to.row === 7)) {
        newBoard[move.to.row][move.to.col] = { type: 'queen', color: piece.color, hasMoved: true };
      }

      if (piece && piece.type === 'king' && Math.abs(move.to.col - move.from.col) === 2) {
        if (move.to.col === 6) {
          newBoard[move.from.row][5] = newBoard[move.from.row][7];
          newBoard[move.from.row][7] = null;
        } else {
          newBoard[move.from.row][3] = newBoard[move.from.row][0];
          newBoard[move.from.row][0] = null;
        }
      }

      let newEP: Position | null = null;
      if (piece && piece.type === 'pawn' && Math.abs(move.to.row - move.from.row) === 2) {
        newEP = { row: (move.from.row + move.to.row) / 2, col: move.from.col };
      }

      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, color, newEP);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBotMove(
  board: Board,
  color: PieceColor,
  difficulty: Difficulty,
  enPassantTarget: Position | null
): { from: Position; to: Position } | null {
  const moves = getAllValidMoves(board, color, enPassantTarget);
  if (moves.length === 0) return null;

  const depthMap: Record<Difficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 2,
  };

  const depth = depthMap[difficulty];
  const isMaximizing = color === 'white';

  // Easy mode: 30% chance of random move
  if (difficulty === 'easy' && Math.random() < 0.3) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestMove = moves[0];
  let bestScore = isMaximizing ? -Infinity : Infinity;

  // Shuffle for variety
  const shuffled = [...moves].sort(() => Math.random() - 0.5);

  for (const move of shuffled) {
    const newBoard = deepCopyBoard(board);
    const piece = newBoard[move.from.row][move.from.col];

    if (piece && piece.type === 'pawn' && enPassantTarget &&
        move.to.row === enPassantTarget.row && move.to.col === enPassantTarget.col) {
      newBoard[move.from.row][move.to.col] = null;
    }

    newBoard[move.to.row][move.to.col] = piece ? { ...piece, hasMoved: true } : null;
    newBoard[move.from.row][move.from.col] = null;

    if (piece && piece.type === 'pawn' && (move.to.row === 0 || move.to.row === 7)) {
      newBoard[move.to.row][move.to.col] = { type: 'queen', color: piece.color, hasMoved: true };
    }

    if (piece && piece.type === 'king' && Math.abs(move.to.col - move.from.col) === 2) {
      if (move.to.col === 6) {
        newBoard[move.from.row][5] = newBoard[move.from.row][7];
        newBoard[move.from.row][7] = null;
      } else {
        newBoard[move.from.row][3] = newBoard[move.from.row][0];
        newBoard[move.from.row][0] = null;
      }
    }

    let newEP: Position | null = null;
    if (piece && piece.type === 'pawn' && Math.abs(move.to.row - move.from.row) === 2) {
      newEP = { row: (move.from.row + move.to.row) / 2, col: move.from.col };
    }

    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, !isMaximizing, color, newEP);

    if (isMaximizing ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  // Medium mode: 10% random deviation
  if (difficulty === 'medium' && Math.random() < 0.1) {
    // Pick a random "decent" move from top 3
    const scored = shuffled.map(move => {
      const newBoard = deepCopyBoard(board);
      const piece = newBoard[move.from.row][move.from.col];
      newBoard[move.to.row][move.to.col] = piece ? { ...piece, hasMoved: true } : null;
      newBoard[move.from.row][move.from.col] = null;
      return { move, score: evaluateBoard(newBoard) };
    });
    scored.sort((a, b) => isMaximizing ? b.score - a.score : a.score - b.score);
    const topMoves = scored.slice(0, Math.min(3, scored.length));
    return topMoves[Math.floor(Math.random() * topMoves.length)].move;
  }

  return bestMove;
}