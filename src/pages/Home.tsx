import { Crown, Sword, Brain, Target, Sparkles, ChevronRight } from 'lucide-react';
import DifficultySelector from '../components/DifficultySelector';
import { Difficulty, PieceColor } from '../types/chess';

interface HomeProps {
  onNavigate: (page: string) => void;
  onStartGame: (difficulty: Difficulty, color: PieceColor) => void;
}

export default function Home({ onNavigate, onStartGame }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-gray-400">Классические шахматы с ИИ</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Chess
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Master
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Играйте в шахматы против умного бота. Три уровня сложности —
            от новичка до мастера. Никакой регистрации, всё бесплатно.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {[
              { icon: Brain, label: 'ИИ-бот' },
              { icon: Target, label: '3 уровня' },
              { icon: Sword, label: 'Все правила' },
            ].map(feat => {
              const Icon = feat.icon;
              return (
                <div key={feat.label} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{feat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Difficulty Selection */}
      <section className="py-8 pb-24 px-4 sm:px-6">
        <DifficultySelector onStart={onStartGame} />
      </section>

      {/* Chess board decoration */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Полноценные шахматы в браузере
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Рокировка, взятие на проходе, превращение пешки в ферзя — все правила реализованы.
            Бот использует алгоритм минимакс с альфа-бета отсечением.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Рокировка', desc: 'Короткая и длинная рокировка с проверкой всех условий' },
              { title: 'En Passant', desc: 'Взятие на проходе полностью реализовано' },
              { title: 'Промоушен', desc: 'Пешка автоматически превращается в ферзя' },
            ].map(feature => (
              <div key={feature.title} className="glass rounded-xl p-5 text-left">
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}