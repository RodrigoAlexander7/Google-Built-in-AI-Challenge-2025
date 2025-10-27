'use client';

import React, { useState, useMemo, useRef } from 'react';
import { WordConnectGameProps, Position, GameState } from '../types/WordConnectGameTypes';

export default function WordConnectGame({ words, onComplete }: WordConnectGameProps) {
  const allLetters = useMemo(() => {
    const set = new Set(words.join('').toUpperCase().split(''));
    return Array.from(set);
  }, [words]);

  const [gameState, setGameState] = useState<GameState>({
    current: '',
    found: [],
    isDragging: false
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const radius = 120;
  const center: Position = { x: 150, y: 150 };
  
  const positions = useMemo(() => {
    const step = (2 * Math.PI) / allLetters.length;
    return allLetters.map((_, i): Position => ({
      x: center.x + radius * Math.cos(i * step - Math.PI / 2),
      y: center.y + radius * Math.sin(i * step - Math.PI / 2),
    }));
  }, [allLetters]);

  function handleMouseDown(letter: string) {
    setGameState(prev => ({ ...prev, isDragging: true, current: letter }));
    drawLines([letter]);
  }

  function handleMouseEnter(letter: string) {
    if (!gameState.isDragging) return;
    setGameState(prev => {
      if (prev.current.includes(letter)) return prev;
      const next = prev.current + letter;
      drawLines(next.split(''));
      return { ...prev, current: next };
    });
  }

  function handleMouseUp() {
    if (!gameState.isDragging) return;
    setGameState(prev => {
      evaluateWord(prev.current);
      return { ...prev, isDragging: false, current: '' };
    });
    clearCanvas();
  }

  function evaluateWord(word: string) {
    const w = word.toUpperCase();
    if (words.includes(w) && !gameState.found.includes(w)) {
      const newFound = [...gameState.found, w];
      setGameState(prev => ({ ...prev, found: newFound }));
      
      if (newFound.length === words.length) {
        onComplete?.();
      }
    }
  }

  function drawLines(sequence: string[]) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    clearCanvas();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    sequence.forEach((letter, i) => {
      const index = allLetters.indexOf(letter);
      if (index === -1) return;
      const { x, y } = positions[index];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function clearCanvas() {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 300);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[300px] h-[300px]">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="absolute top-0 left-0 pointer-events-none"
        />

        {allLetters.map((letter, i) => {
          const pos = positions[i];
          const foundColor = gameState.found.some((w) => w.includes(letter));
          return (
            <div
              key={letter}
              onMouseDown={() => handleMouseDown(letter)}
              onMouseEnter={() => handleMouseEnter(letter)}
              onMouseUp={handleMouseUp}
              className={`absolute flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold cursor-pointer select-none transition-colors
                ${foundColor ? 'bg-green-400 text-white' : 'bg-indigo-100 hover:bg-indigo-300'}
              `}
              style={{
                left: pos.x - 24,
                top: pos.y - 24,
                userSelect: 'none',
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        {words.map((w) => (
          <div
            key={w}
            className={`text-lg font-semibold ${
              gameState.found.includes(w) ? 'line-through text-green-600' : 'text-gray-600'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {gameState.isDragging && (
        <div className="text-2xl font-bold text-indigo-600 tracking-widest">{gameState.current}</div>
      )}
    </div>
  );
}