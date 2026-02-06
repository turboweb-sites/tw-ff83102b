import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'game', label: 'Играть' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all overflow-hidden">
              <img 
                src="https://pub-166557a34b174b9a90d5376150b1d05a.r2.dev/assets/ff83102b-21db-493b-918a-dbd1da1c591d/c84d458d-1ede-4401-94dd-0561a4a9322e/ChatGPT_Image_25_________2026______17_32_05_removebg_preview_1770406252120_h9rry3.webp"
                alt="Chess Master Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Chess Master
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-2 animate-fade-in">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setIsOpen(false); }}
                className={`block w-full text-left py-3 px-4 rounded-xl mb-1 transition-all ${
                  currentPage === item.id
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}