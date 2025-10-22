'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface WordSearchProps {
  words: string[];
  size?: number;
  onComplete?: () => void;
}

// Direcciones: 8 posibles (fila, columna)
const DIRECTIONS: Array<[number, number]> = [
  [0, 1],  // →
  [0, -1], // ←
  [1, 0],  // ↓
  [-1, 0], // ↑
  [1, 1],  // ↘
  [1, -1], // ↙
  [-1, 1], // ↗
  [-1, -1] // ↖
];

type Cell = [number, number];
type Placement = { word: string; cells: Cell[] };

export default function WordSearchGame({ words, size = 10, onComplete }: WordSearchProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [foundIds, setFoundIds] = useState<Set<number>>(new Set());

  const startCellRef = useRef<Cell | null>(null);
  const dirRef = useRef<[number, number] | null>(null);
  const completedRef = useRef(false);

  // Stable key based on words content (case-insensitive). Prevents re-gen on new array refs.
  const wordsKey = useMemo(
    () => JSON.stringify(words.map(w => w.toUpperCase())),
    // depende de 'words' pero el efecto depende del valor primitivo wordsKey
    [words]
  );

  // Generar grid y placements solo cuando cambie el contenido de words o el size
  useEffect(() => {
    const upperWords = words.map((w) => w.toUpperCase());
    const { grid, placements } = generateGridWithPlacements(size, upperWords);
    setGrid(grid);
    setPlacements(placements);
    setSelectedCells([]);
    setFoundIds(new Set());
    completedRef.current = false;
  }, [size, wordsKey]);

  // Conjunto de celdas encontradas para resaltar
  const foundCellSet = useMemo(() => {
    const s = new Set<string>();
    for (const idx of foundIds) {
      placements[idx]?.cells.forEach(([r, c]) => s.add(`${r},${c}`));
    }
    return s;
  }, [foundIds, placements]);

  // Lista de palabras, con estado encontrado
  const wordItems = useMemo(
    () => placements.map((p, idx) => ({ word: p.word, found: foundIds.has(idx) })),
    [placements, foundIds]
  );

  // Completar juego cuando todas las palabras estén encontradas
  useEffect(() => {
    if (!completedRef.current && placements.length > 0 && foundIds.size === placements.length) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [foundIds, placements, onComplete]);

  // Handlers de selección (click/drag)
  const onCellMouseDown = (r: number, c: number) => {
    setIsSelecting(true);
    startCellRef.current = [r, c];
    dirRef.current = null;
    setSelectedCells([[r, c]]);
  };

  const onCellMouseEnter = (r: number, c: number) => {
    if (!isSelecting || !startCellRef.current) return;
    const [sr, sc] = startCellRef.current;

    // Determinar dirección si aún no existe
    if (!dirRef.current) {
      const dr = Math.sign(r - sr);
      const dc = Math.sign(c - sc);
      if (dr === 0 && dc === 0) {
        setSelectedCells([[sr, sc]]);
        return;
      }
      dirRef.current = [dr, dc];
    }

    const [dr, dc] = dirRef.current;
    // Forzar alineación a la dirección calculada
    // Proyección de (r - sr, c - sc) en pasos máximos de esa dirección
    const steps = Math.max(Math.abs(r - sr), Math.abs(c - sc));
    const next: Cell[] = [];
    for (let i = 0; i <= steps; i++) {
      const rr = sr + dr * i;
      const cc = sc + dc * i;
      if (rr < 0 || rr >= size || cc < 0 || cc >= size) break;
      next.push([rr, cc]);
    }
    setSelectedCells(next);
  };

  const onSelectionRelease = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    validateSelection();
    startCellRef.current = null;
    dirRef.current = null;
  };

  // Evaluar selección contra placements
  const validateSelection = () => {
    if (selectedCells.length === 0) {
      setSelectedCells([]);
      return;
    }

    for (let i = 0; i < placements.length; i++) {
      if (foundIds.has(i)) continue;

      const path = placements[i].cells;
      if (samePath(selectedCells, path) || samePath(selectedCells, [...path].reverse())) {
        setFoundIds((prev) => new Set(prev).add(i));
        setSelectedCells([]);
        return;
      }
    }

    // No coincide con palabras colocadas
    setSelectedCells([]);
  };

  return (
    <div className="flex gap-6 select-none" onMouseUp={onSelectionRelease} onMouseLeave={onSelectionRelease}>
      {/* Grid principal */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 2rem)` }}>
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = `${r}-${c}`;
            const isSelected = selectedCells.some(([rr, cc]) => rr === r && cc === c);
            const isFound = foundCellSet.has(`${r},${c}`);
            return (
              <div
                key={key}
                onMouseDown={() => onCellMouseDown(r, c)}
                onMouseEnter={() => onCellMouseEnter(r, c)}
                className={`w-8 h-8 flex items-center justify-center border text-sm font-bold cursor-pointer rounded
                  ${isFound ? 'bg-green-300 text-gray-900' : isSelected ? 'bg-yellow-200' : 'bg-white hover:bg-gray-100'}
                `}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>

      {/* Palabras a encontrar */}
      <div className="flex flex-col text-sm min-w-[140px]">
        <h3 className="font-semibold mb-2">Palabras</h3>
        {wordItems.map(({ word, found }) => (
          <div key={word} className={`mb-1 ${found ? 'line-through text-green-600' : ''}`}>
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Utilidades ---------- */

// Genera grid y posiciones exactas para cada palabra
function generateGridWithPlacements(size: number, words: string[]): { grid: string[][]; placements: Placement[] } {
  const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
  const placements: Placement[] = [];

  // Intentar colocar cada palabra con múltiples intentos
  for (const word of words) {
    const placed = tryPlaceWord(grid, size, word);
    if (placed) placements.push(placed);
  }

  // Rellenar espacios vacíos
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placements };
}

function tryPlaceWord(grid: string[][], size: number, word: string): Placement | null {
  const attempts = 300;
  for (let t = 0; t < attempts; t++) {
    const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const maxRow = dr === -1 ? size - 1 : size - (dr === 1 ? word.length : 0);
    const maxCol = dc === -1 ? size - 1 : size - (dc === 1 ? word.length : 0);
    const minRow = dr === 1 ? 0 : dr === -1 ? word.length - 1 : 0;
    const minCol = dc === 1 ? 0 : dc === -1 ? word.length - 1 : 0;

    const startR = randInt(minRow, maxRow);
    const startC = randInt(minCol, maxCol);

    const cells: Cell[] = [];
    let fits = true;

    for (let i = 0; i < word.length; i++) {
      const r = startR + dr * i;
      const c = startC + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) {
        fits = false; break;
      }
      const existing = grid[r][c];
      if (existing && existing !== word[i]) {
        fits = false; break;
      }
      cells.push([r, c]);
    }

    if (!fits) continue;

    // Escribir letras
    for (let i = 0; i < word.length; i++) {
      const [r, c] = cells[i];
      grid[r][c] = word[i];
    }

    return { word, cells };
  }

  // Falló colocar la palabra; devolver null (se omite esa palabra)
  return null;
}

function randInt(min: number, max: number): number {
  // ambos inclusivos
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function samePath(a: Cell[], b: Cell[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) return false;
  }
  return true;
}
