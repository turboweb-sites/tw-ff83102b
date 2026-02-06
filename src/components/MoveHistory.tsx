import { ScrollText } from 'lucide-react';
import { Move } from '../types/chess';
import { useEffect, useRef } from 'react';

interface MoveHistoryProps {
  moves: Move[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  const pairs: { num: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i]?.notation,
      black: moves[i + 1]?.notation,
    });
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <ScrollText className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-gray-300">История ходов</h3>
        <span className="text-xs text-gray-600 ml-auto">{moves.length} ходов</span>
      </div>

      <div ref={scrollRef} className="max-h-[280px] overflow-y-auto p-3">
        {pairs.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6">
            Сделайте первый ход...
          </p>
        ) : (
          <div className="space-y-0.5">
            {pairs.map(pair => (
              <div
                key={pair.num}
                className={`flex items-center text-sm rounded-lg px-2 py-1.5 ${
                  pair.num === pairs.length ? 'bg-white/5' : ''
                }`}
              >
                <span className="w-8 text-gray-600 font-mono text-xs">{pair.num}.</span>
                <span className="w-20 font-mono text-gray-200 font-medium">{pair.white || ''}</span>
                <span className="w-20 font-mono text-gray-400">{pair.black || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}