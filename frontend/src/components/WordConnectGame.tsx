'use client';

import React, { useState, useMemo, useRef } from 'react';

interface WordConnectGameProps {
  words: string[]; // Palabras válidas
  onComplete?: () => void; // callback cuando se encuentren todas
}

/**
 * Juego tipo "Word Connect": letras en círculo, conecta para formar palabras.
 */
export default function WordConnectGame({ words, onComplete }: WordConnectGameProps) {
  const allLetters = useMemo(() => {
    // Crear conjunto único de letras a partir de todas las palabras
    const set = new Set(words.join('').toUpperCase().split(''));
    return Array.from(set);
  }, [words]);

  const [current, setCurrent] = useState<string>(''); // palabra formada actualmente
  const [found, setFound] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Posiciones circulares de las letras
  const radius = 120;
  const center = { x: 150, y: 150 };
  const positions = useMemo(() => {
    const step = (2 * Math.PI) / allLetters.length;
    return allLetters.map((_, i) => ({
      x: center.x + radius * Math.cos(i * step - Math.PI / 2),
      y: center.y + radius * Math.sin(i * step - Math.PI / 2),
    }));
  }, [allLetters]);

  /** Iniciar arrastre */
  function handleMouseDown(letter: string) {
    setIsDragging(true);
    setCurrent(letter);
    drawLines([letter]);
  }

  /** Seguir arrastre */
  function handleMouseEnter(letter: string) {
    if (!isDragging) return;
    setCurrent((prev) => {
      if (prev.includes(letter)) return prev; // no repetir
      const next = prev + letter;
      drawLines(next.split(''));
      return next;
    });
  }

  /** Soltar arrastre: evaluar palabra */
  function handleMouseUp() {
    if (!isDragging) return;
    setIsDragging(false);
    evaluateWord(current);
    setCurrent('');
    clearCanvas();
  }

  /** Evaluar palabra */
  function evaluateWord(word: string) {
    const w = word.toUpperCase();
    if (words.includes(w) && !found.includes(w)) {
      setFound((f) => [...f, w]);
    }
    if (found.length + 1 === words.length) {
      onComplete?.();
    }
  }

  /** Dibuja líneas entre letras conectadas */
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

        {/* Letras en círculo */}
        {allLetters.map((letter, i) => {
          const pos = positions[i];
          const foundColor = found.some((w) => w.includes(letter));
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

      {/* Palabras por encontrar */}
      <div className="grid grid-cols-2 gap-3 text-center">
        {words.map((w) => (
          <div
            key={w}
            className={`text-lg font-semibold ${
              found.includes(w) ? 'line-through text-green-600' : 'text-gray-600'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* palabra actual (visual feedback) */}
      {isDragging && (
        <div className="text-2xl font-bold text-indigo-600 tracking-widest">{current}</div>
      )}
    </div>
  );
}
