'use client';

import React, { useState } from 'react';
import Template from "../../pages/Template";
import LearnPlayPage from "./LearnPlayPage";
import { GameOne, GameTwo, GameThree, GameFour } from '@/components/ReactGameComponents';
import { crosswordGames } from '@/resources/files/mockCrossword';
import { wordSearchGames } from '@/resources/files/mockSearchWord';
import { wordConnectGames } from '@/resources/files/mockWordConnect';
import { explainItGames } from '@/resources/files/mockExplainIt';

interface SelectedGame {
  type: 'crossword' | 'wordsearch' | 'wordconnect' | 'explainit';
  id: number;
  title: string;
}

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);

  const handleGameSelect = (type: string, id: number) => {
    let gameData;
    
    switch (type) {
      case 'crossword':
        gameData = crosswordGames.find(g => g.id === id);
        break;
      case 'wordsearch':
        gameData = wordSearchGames.find(g => g.id === id);
        break;
      case 'wordconnect':
        gameData = wordConnectGames.find(g => g.id === id);
        break;
      case 'explainit':
        gameData = explainItGames.find(g => g.id === id);
        break;
      default:
        return;
    }

    if (gameData) {
      setSelectedGame({
        type: type as any,
        id,
        title: 'title' in gameData ? gameData.title : gameData.question
      });
    }
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    switch (selectedGame.type) {
      case 'crossword':
        const crosswordGame = crosswordGames.find(g => g.id === selectedGame.id);
        return crosswordGame ? (
          <GameThree 
            words={crosswordGame.words}
            size={crosswordGame.size}
            onComplete={() => console.log('Crucigrama completado!')}
          />
        ) : null;

      case 'wordsearch':
        const wordSearchGame = wordSearchGames.find(g => g.id === selectedGame.id);
        return wordSearchGame ? (
          <GameOne 
            words={wordSearchGame.words}
            size={wordSearchGame.size}
            onComplete={() => console.log('Sopa de letras completada!')}
          />
        ) : null;

      case 'wordconnect':
        const wordConnectGame = wordConnectGames.find(g => g.id === selectedGame.id);
        return wordConnectGame ? (
          <GameTwo 
            words={wordConnectGame.words}
            onComplete={() => console.log('Conecta palabras completado!')}
          />
        ) : null;

      case 'explainit':
        const explainItGame = explainItGames.find(g => g.id === selectedGame.id);
        return explainItGame ? (
          <GameFour 
            question={explainItGame.question}
            onComplete={() => console.log('Explícalo completado!')}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Template onGameSelect={handleGameSelect}>
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
        <LearnPlayPage onGameSelect={handleGameSelect} />
      )}
    </Template>
  );
}