import { Users, Bot } from 'lucide-react';
import { GameMode } from '../types/chess';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

export default function GameModeSelector({ onSelectMode }: GameModeSelectorProps) {
  const modes: { id: GameMode; label: string; desc: string; icon: any; color: string; glow: string }[] = [
    {
      id: 'bot',
      label: 'Играть с ботом',
      desc: 'Выберите сложность и играйте против искусственного интеллекта',
      icon: Bot,
      color: 'from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/20 hover:shadow-purple-500/40',
    },
    {
      id: 'pvp',
      label: 'Играть вдвоём',
      desc: 'Локальная игра на одном устройстве. Белые ходят первыми.',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      glow: 'shadow-blue-500/20 hover:shadow-blue-500/40',
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Выберите режим игры
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {modes.map(mode => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer shadow-xl ${mode.glow} group text-left`}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{mode.label}</h3>
              <p className="text-gray-400 leading-relaxed">{mode.desc}</p>
              
              <div className="mt-6 flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                <span>Выбрать</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500 max-w-md mx-auto">
        <p>💡 Совет: в режиме "Вдвоём" игроки меняются местами после каждого хода</p>
      </div>
    </div>
  );
}