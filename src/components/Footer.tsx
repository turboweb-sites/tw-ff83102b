import { Crown, Github, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 group"
          >
            <Crown className="w-5 h-5 text-primary-500" />
            <span className="font-semibold text-gray-400 group-hover:text-white transition">
              Chess Master
            </span>
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-sm text-gray-500 hover:text-gray-300 transition"
            >
              Главная
            </button>
            <button
              onClick={() => setCurrentPage('game')}
              className="text-sm text-gray-500 hover:text-gray-300 transition"
            >
              Играть
            </button>
          </div>

          <p className="text-sm text-gray-600 flex items-center gap-1">
            Сделано с <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> для любителей шахмат
          </p>
        </div>
      </div>
    </footer>
  );
}