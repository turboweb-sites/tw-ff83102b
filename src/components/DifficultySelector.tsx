import { Brain, Zap, Trophy, ArrowLeft } from 'lucide-react';
import { Difficulty, PieceColor } from '../types/chess';

interface DifficultySelectorProps {
  onStart: (difficulty: Difficulty, color: PieceColor) => void;
  onBack: () => void;
}

export default function DifficultySelector({ onStart, onBack }: DifficultySelectorProps) {
  const difficulties: { id: Difficulty; label: string; desc: string; icon: any; color: string; glow: string }[] = [
    {
      id: 'easy',
      label: 'Новичок',
      desc: 'Бот играет слабо, делает случайные ходы. Подойдёт для обучения.',
      icon: Zap,
      color: 'from-emerald-500 to-green-600',
      glow: 'shadow-emerald-500/20 hover:shadow-emerald-500/40',
    },
    {
      id: 'medium',
      label: 'Любитель',
      desc: 'Бот думает на 2 хода вперёд. Хороший вызов для продвинутых.',
      icon: Brain,
      color: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/20 hover:shadow-amber-500/40',
    },
    {
      id: 'hard',
      label: 'Мастер',
      desc: 'Бот анализирует на 3 хода вперёд. Только для сильных игроков!',
      icon: Trophy,
      color: 'from-red-500 to-rose-600',
      glow: 'shadow-red-500/20 hover:shadow-red-500/40',
    },
  ];

  const colors: { id: PieceColor; label: string; emoji: string }[] = [
    { id: 'white', label: 'Белые', emoji: '♔' },
    { id: 'black', label: 'Чёрные', emoji: '♚' },
  ];

  return (
    <div className="space-y-12 animate-slide-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Назад к выбору режима</span>
      </button>

      {/* Difficulty cards */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Выберите сложность
        </h2>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {difficulties.map(diff => {
            const Icon = diff.icon;
            return (
              <div key={diff.id} className="group">
                <div className={`glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer shadow-xl ${diff.glow}`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${diff.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{diff.label}</h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{diff.desc}</p>

                  <div className="flex gap-2">
                    {colors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => onStart(diff.id, color.id)}
                        className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                          color.id === 'white'
                            ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-white/10'
                            : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        <span className="text-lg">{color.emoji}</span>
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}