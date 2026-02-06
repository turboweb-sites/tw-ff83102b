import { Board, Piece, PieceColor, Position, Move, Square } from '../../types/chess';

export function deepCopyBoard(board: Board): Board {
  return board.map(row => row.map(sq => (sq ? { ...sq } : null)));
}

export function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function findKing(board: Board, color: PieceColor): Position | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

export function isSquareAttacked(board: Board, pos: Position, byColor: PieceColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === byColor) {
        const moves = getRawMoves(board, { row: r, col: c }, null, true);
        if (moves.some(m => m.row === pos.row && m.col === pos.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isInCheck(board: Board, color: PieceColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opponent = color === 'white' ? 'black' : 'white';
  return isSquareAttacked(board, kingPos, opponent);
}

function getRawMoves(board: Board, pos: Position, enPassantTarget: Position | null, attackOnly: boolean = false): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Position[] = [];
  const { row, col } = pos;
  const color = piece.color;
  const opponent = color === 'white' ? 'black' : 'white';

  switch (piece.type) {
    case 'pawn': {
      const dir = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;

      if (!attackOnly) {
        if (isInBounds(row + dir, col) && !board[row + dir][col]) {
          moves.push({ row: row + dir, col });
          if (row === startRow && !board[row + 2 * dir][col]) {
            moves.push({ row: row + 2 * dir, col });
          }
        }
      }

      for (const dc of [-1, 1]) {
        const nr = row + dir;
        const nc = col + dc;
        if (isInBounds(nr, nc)) {
          if (attackOnly) {
            moves.push({ row: nr, col: nc });
          } else {
            const target = board[nr][nc];
            if (target && target.color === opponent) {
              moves.push({ row: nr, col: nc });
            }
            if (enPassantTarget && enPassantTarget.row === nr && enPassantTarget.col === nc) {
              moves.push({ row: nr, col: nc });
            }
          }
        }
      }
      break;
    }

    case 'knight': {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightMoves) {
        const nr = row + dr;
        const nc = col + dc;
        if (isInBounds(nr, nc)) {
          const target = board[nr][nc];
          if (!target || target.color === opponent) {
            moves.push({ row: nr, col: nc });
          }
        }
      }
      break;
    }

    case 'bishop': {
      const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dr, dc] of dirs) {
        let nr = row + dr;
        let nc = col + dc;
        while (isInBounds(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ row: nr, col: nc });
          } else {
            if (target.color === opponent) moves.push({ row: nr, col: nc });
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      break;
    }

    case 'rook': {
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        let nr = row + dr;
        let nc = col + dc;
        while (isInBounds(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ row: nr, col: nc });
          } else {
            if (target.color === opponent) moves.push({ row: nr, col: nc });
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      break;
    }

    case 'queen': {
      const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [dr, dc] of dirs) {
        let nr = row + dr;
        let nc = col + dc;
        while (isInBounds(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ row: nr, col: nc });
          } else {
            if (target.color === opponent) moves.push({ row: nr, col: nc });
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      break;
    }

    case 'king': {
      const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        if (isInBounds(nr, nc)) {
          const target = board[nr][nc];
          if (!target || target.color === opponent) {
            moves.push({ row: nr, col: nc });
          }
        }
      }
      break;
    }
  }

  return moves;
}

export function getValidMoves(board: Board, pos: Position, enPassantTarget: Position | null): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const rawMoves = getRawMoves(board, pos, enPassantTarget);
  const validMoves: Position[] = [];

  for (const move of rawMoves) {
    const testBoard = deepCopyBoard(board);
    testBoard[move.row][move.col] = testBoard[pos.row][pos.col];
    testBoard[pos.row][pos.col] = null;

    if (piece.type === 'pawn' && enPassantTarget &&
        move.row === enPassantTarget.row && move.col === enPassantTarget.col) {
      const capturedRow = pos.row;
      testBoard[capturedRow][move.col] = null;
    }

    if (!isInCheck(testBoard, piece.color)) {
      validMoves.push(move);
    }
  }

  // Castling
  if (piece.type === 'king' && !piece.hasMoved && !isInCheck(board, piece.color)) {
    const row = pos.row;
    const opponent = piece.color === 'white' ? 'black' : 'white';

    // Kingside
    const kRook = board[row][7];
    if (kRook && kRook.type === 'rook' && kRook.color === piece.color && !kRook.hasMoved) {
      if (!board[row][5] && !board[row][6]) {
        if (!isSquareAttacked(board, { row, col: 5 }, opponent) &&
            !isSquareAttacked(board, { row, col: 6 }, opponent)) {
          validMoves.push({ row, col: 6 });
        }
      }
    }

    // Queenside
    const qRook = board[row][0];
    if (qRook && qRook.type === 'rook' && qRook.color === piece.color && !qRook.hasMoved) {
      if (!board[row][1] && !board[row][2] && !board[row][3]) {
        if (!isSquareAttacked(board, { row, col: 2 }, opponent) &&
            !isSquareAttacked(board, { row, col: 3 }, opponent)) {
          validMoves.push({ row, col: 2 });
        }
      }
    }
  }

  return validMoves;
}

export function getAllValidMoves(board: Board, color: PieceColor, enPassantTarget: Position | null): { from: Position; to: Position }[] {
  const allMoves: { from: Position; to: Position }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row: r, col: c }, enPassantTarget);
        for (const to of moves) {
          allMoves.push({ from: { row: r, col: c }, to });
        }
      }
    }
  }
  return allMoves;
}

export function getMoveNotation(board: Board, from: Position, to: Position, piece: Piece, captured: Square, isCastling: boolean, isPromotion: boolean): string {
  if (isCastling) {
    return to.col === 6 ? 'O-O' : 'O-O-O';
  }

  const colLetters = 'abcdefgh';
  const pieceLetters: Record<string, string> = {
    king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N', pawn: ''
  };

  let notation = pieceLetters[piece.type];

  if (piece.type === 'pawn' && captured) {
    notation += colLetters[from.col];
  }

  if (captured) {
    notation += 'x';
  }

  notation += colLetters[to.col] + (8 - to.row);

  if (isPromotion) {
    notation += '=Q';
  }

  return notation;
}