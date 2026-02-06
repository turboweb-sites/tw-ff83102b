export type PieceColor = 'white' | 'black';
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
  isCastling?: boolean;
  isEnPassant?: boolean;
  notation?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'bot' | 'pvp';

export type GameStatus = 'waiting' | 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export interface GameState {
  board: Board;
  currentTurn: PieceColor;
  status: GameStatus;
  moveHistory: Move[];
  selectedSquare: Position | null;
  validMoves: Position[];
  capturedPieces: { white: Piece[]; black: Piece[] };
  gameMode: GameMode;
  playerColor: PieceColor;
  difficulty: Difficulty;
  enPassantTarget: Position | null;
  isThinking: boolean;
}