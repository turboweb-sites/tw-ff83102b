import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Game from './pages/Game';
import { Difficulty, PieceColor } from './types/chess';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerColor, setPlayerColor] = useState<PieceColor>('white');

  const startGame = (diff: Difficulty, color: PieceColor) => {
    setDifficulty(diff);
    setPlayerColor(color);
    setCurrentPage('game');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f13]">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home onNavigate={setCurrentPage} onStartGame={startGame} />
        )}
        {currentPage === 'game' && (
          <Game
            onNavigate={setCurrentPage}
            difficulty={difficulty}
            playerColor={playerColor}
          />
        )}
      </main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}