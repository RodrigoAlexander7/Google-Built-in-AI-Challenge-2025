'use client';

import React, { useState } from 'react';
import { explainItGames } from '@/resources/files/mockExplainIt';
import PromptInput from '@/components/layout/PromptInput';
import ListBox from '@/components/ui/ListBox/ListBox';
import Slider from '@/components/ui/Slider/Slider';
import { Api, createWordSearchGame, createCrosswordGame } from '@/services/api';

interface CategoryMenuProps {
  title: string;
  options: string[];
  onSelect: (option: string) => void;
  selectedOption: string;
}

function CategoryMenu({ title, options, onSelect, selectedOption }: CategoryMenuProps) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        {title}
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <li
            key={option}
            onClick={() => onSelect(option)}
            className={`cursor-pointer rounded-2xl p-6 text-center font-bold transition-all duration-500 ease-out transform border-2
              ${
                selectedOption === option
                  ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl scale-105 border-transparent ring-4 ring-blue-200 ring-opacity-50'
                  : 'bg-white text-gray-800 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 border-gray-200 hover:border-blue-300 hover:shadow-xl hover:scale-105'
              }`}
          >
            <span className="relative z-10">{option}</span>
            {selectedOption === option && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-80"></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Difficulty = 'easy' | 'medium' | 'hard';

type SelectedGamePayload =
  | { type: 'wordsearch' | 'wordconnect'; title: string; words: string[]; difficulty: Difficulty }
  | { type: 'crossword'; title: string; words: { word: string; clue: string }[]; difficulty: Difficulty }
  | { type: 'explainit'; id: number; title: string };

interface LearnPlayPageProps {
  onGameSelect: (game: SelectedGamePayload) => void;
}

export default function LearnPlayPage({ onGameSelect }: LearnPlayPageProps) {
  const menuData = [
    {
      title: '🎮 Juegos de vocabulario',
      options: ['Sopa de letras', 'Conecta letras'],
    },
    {
      title: '🧩 Juegos de puzzle',
      options: ['Explicalo!', 'Crucigrama'],
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string>('Sopa de letras');
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<string>('Spanish');
  const [difficulty, setDifficulty] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Map numeric difficulty to text label
  const difficultyLabels: Record<number, string> = { 1: 'fácil', 2: 'medio', 3: 'difícil' };
  const difficultyText = difficultyLabels[difficulty] ?? String(difficulty);

  const languageItems = [
    { id: 'Spanish', title: 'Spanish' },
    { id: 'English', title: 'English' },
    { id: 'Portuguese', title: 'Portuguese' },
    { id: 'French', title: 'French' },
    { id: 'German', title: 'German' },
  ];

  const gameTypeMap = {
    'Sopa de letras': 'wordsearch',
    'Conecta letras': 'wordconnect',
    'Explicalo!': 'explainit',
    'Crucigrama': 'crossword'
  };

  const handleStartGame = async () => {
    const gameType = gameTypeMap[selectedOption as keyof typeof gameTypeMap];

    // Build final topic including textual difficulty
    const finalTopic = `${(topic || 'General').trim()} - dificultad ${difficultyText}`;
    const difficultyCode: Difficulty = difficulty === 1 ? 'easy' : difficulty === 3 ? 'hard' : 'medium';

    setError(null);
    setLoading(true);

    try {
      if (gameType === 'wordsearch') {
        const payload = { topic: finalTopic, language };
        console.log('WS - Start payload:', { ...payload, game_type: 'word_search' });
        const data = await createWordSearchGame(payload);

        const words: string[] = Array.isArray(data?.words)
          ? data.words.map((w: any) => String(w).toUpperCase())
          : [];

        onGameSelect({
          type: 'wordsearch',
          title: data?.title || 'Sopa de Letras',
          words,
          difficulty: difficultyCode,
        });
        return;
      }

      if (gameType === 'wordconnect') {
        const topicPrefixed = `Word connect de ${finalTopic}`;
        const payload = { topic: topicPrefixed, language };
        console.log('WC - Start payload (uses word_search):', { ...payload, game_type: 'word_search' });
        const data = await createWordSearchGame(payload);
        const words: string[] = Array.isArray(data?.words)
          ? data.words.map((w: any) => String(w).toUpperCase())
          : [];

        onGameSelect({
          type: 'wordconnect',
          title: `Word connect de ${data?.title || (topic || 'General')}`,
          words,
          difficulty: difficultyCode,
        });
        return;
      }

      if (gameType === 'crossword') {
        const payload = { topic: finalTopic, language };
        console.log('CW - Start payload:', { ...payload, game_type: 'crossword' });
        const data = await createCrosswordGame(payload);
        const words: { word: string; clue: string }[] = Array.isArray(data?.words)
          ? data.words.map((w: any) => ({ word: String(w.word).toUpperCase(), clue: String(w.clue) }))
          : [];

        onGameSelect({
          type: 'crossword',
          title: data?.title || 'Crucigrama',
          words,
          difficulty: difficultyCode,
        });
        return;
      }

      // Fallback for explainit (no API integration now)
      if (gameType === 'explainit') {
        const randomId = Math.floor(Math.random() * explainItGames.length) + 1;
        const item = explainItGames.find((g) => g.id === randomId);
        onGameSelect({ type: 'explainit', id: randomId, title: item ? item.question : 'Explícalo' });
        return;
      }
    } catch (err: any) {
      console.error('Game start error:', err);
      setError(err?.message || 'No se pudo iniciar el juego.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-6xl">🎯</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Descubre tu próxima aventura de aprendizaje. Selecciona tu juego preferido y comienza a divertirte mientras aprendes.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-12 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-lg">Juego seleccionado:</span>
              <span className="ml-3 text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedOption}
              </span>
            </div>
            <button 
              onClick={handleStartGame}
              disabled={loading}
              className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {loading ? 'Cargando…' : '¡Comenzar!'}
            </button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tópico</label>
              <PromptInput
                placeholder="Escribe un tópico y presiona enviar..."
                onSendMessage={(msg) => setTopic(msg.trim())}
              />
              <p className="text-xs text-gray-500">
                Actual: {topic ? `"${topic}"` : 'Sin tópico'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Idioma</label>
              <ListBox
                items={languageItems}
                selectionMode="single"
                selectedIds={[language]}
                onSelectionChange={(ids) => setLanguage(ids[0] || 'Spanish')}
              />
              <p className="text-xs text-gray-500">Seleccionado: {language}</p>
            </div>

            <div className="md:col-span-2">
              <Slider
                min={1}
                max={3}
                step={1}
                value={difficulty}
                onChange={setDifficulty}
                label="Dificultad"
                showMinMaxLabels
              />
              <p className="text-xs text-gray-500 mt-1">Se concatenará al tópico como: "{(topic || 'General').trim()} - dificultad {difficultyText}"</p>
              {error && (
                <p className="text-xs mt-2 text-red-600">{error}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {menuData.map((category) => (
            <CategoryMenu
              key={category.title}
              title={category.title}
              options={category.options}
              selectedOption={selectedOption}
              onSelect={handleSelectOption}
            />
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-600 mb-6">
              Presiona el botón para iniciar tu experiencia de aprendizaje con <span className="font-semibold text-blue-600">{selectedOption}</span>
            </p>
            <button 
              onClick={handleStartGame}
              disabled={loading}
              className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl transform transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-3xl hover:scale-110'}`}
            >
              {loading ? 'Generando…' : '🚀 Empezar a Jugar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}