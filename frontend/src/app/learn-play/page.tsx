'use client';

import React, { useState } from 'react';
import Template from "../../pages/Template";
import LearnPlayPage from "./LearnPlayPage";
import { GameOne, GameTwo, GameThree, GameFour } from '@/components/ReactGameComponents';
import { explainItGames } from '@/resources/files/mockExplainIt';

type Difficulty = 'easy' | 'medium' | 'hard';

type SelectedGame =
  | { type: 'wordsearch' | 'wordconnect'; title: string; words: string[]; difficulty: Difficulty }
  | { type: 'crossword'; title: string; words: { word: string; clue: string }[]; difficulty: Difficulty }
  | { type: 'explainit'; id: number; title: string };

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);

  // New handler: called by LearnPlayPage after API returns data
  const handleGameSelectFromAPI = (game: SelectedGame) => {
    setSelectedGame(game);
  };

  // Legacy handler for Sidebar (mock-based)
  const handleGameSelectFromSidebar = (type: string, id: number) => {
    if (type === 'explainit') {
      const gameData = explainItGames.find(g => g.id === id);
      if (gameData) {
        setSelectedGame({ type: 'explainit', id, title: gameData.question });
      }
    }
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    switch (selectedGame.type) {
      case 'crossword': {
        const wordsWithId = selectedGame.words.map((w, idx) => ({ id: idx + 1, word: w.word, clue: w.clue }));
        return (
          <GameThree 
            words={wordsWithId}
            size={12}
            difficulty={selectedGame.difficulty}
            onComplete={() => console.log('Crucigrama completado!')}
          />
        );
      }
      case 'wordsearch': {
        return (
          <GameOne 
            words={selectedGame.words}
            size={12}
            difficulty={selectedGame.difficulty}
            onComplete={() => console.log('Sopa de letras completada!')}
          />
        );
      }
      case 'wordconnect': {
        return (
          <GameTwo 
            words={selectedGame.words}
            difficulty={selectedGame.difficulty}
            onComplete={() => console.log('Conecta palabras completado!')}
          />
        );
      }
      case 'explainit': {
        const explainItGame = explainItGames.find(g => g.id === selectedGame.id);
        return explainItGame ? (
          <GameFour 
            question={explainItGame.question}
            onComplete={() => console.log('Explícalo completado!')}
          />
        ) : null;
      }
      default:
        return null;
    }
  };

  return (
    <Template onGameSelect={handleGameSelectFromSidebar}>
      {selectedGame ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <button 
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-2 transition-colors"
                >
                  <i className="fas fa-arrow-left"></i>
                  Volver al menú
                </button>
                <h1 className="text-3xl font-bold text-gray-900">{selectedGame.title}</h1>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {renderGame()}
            </div>
          </div>
        </div>
      ) : (
        <LearnPlayPage onGameSelect={handleGameSelectFromAPI} />
      )}
    </Template>
  );
}