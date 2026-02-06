import { PieceType, PieceColor } from '../types/chess';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  size?: number;
}

const PIECE_UNICODE: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
};

export default function ChessPiece({ type, color, size = 40 }: ChessPieceProps) {
  return (
    <span
      className="chess-piece inline-flex items-center justify-center leading-none select-none"
      style={{
        fontSize: `${size}px`,
        color: color === 'white' ? '#ffffff' : '#000000',
        filter: color === 'white'
          ? 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))'
          : 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
        lineHeight: 1,
      }}
    >
      {PIECE_UNICODE[color][type]}
    </span>
  );
}