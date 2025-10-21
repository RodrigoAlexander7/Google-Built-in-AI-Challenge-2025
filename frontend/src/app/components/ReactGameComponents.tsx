import React, { useEffect, useState, useRef } from 'react';

// React + TypeScript components for 5 generic games built on a shared GameShell.
// Tailwind v4 is assumed available; all styling is done using Tailwind classes inside this file.

/* ---------- Types ---------- */
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameParams {
  timeSeconds: number; // countdown start
  difficulty: Difficulty;
  hints: number; // available hints
}

export interface GameStats {
  timeStartedAt: number;
  timeEndedAt: number;
  timeRemaining: number;
  hintsUsed: number;
  difficulty: Difficulty;
  won: boolean;
}

/* ---------- Utility: score calculation ---------- */
function computeScore(stats: GameStats): number {
  // Simple, transparent formula:
  // base by difficulty, +time bonus (seconds left), -hint penalty
  const base = stats.difficulty === 'easy' ? 100 : stats.difficulty === 'medium' ? 200 : 350;
  const timeBonus = Math.max(0, Math.floor(stats.timeRemaining));
  const hintPenalty = stats.hintsUsed * 25;
  const winBonus = stats.won ? 150 : 0;
  return Math.max(0, base + timeBonus + winBonus - hintPenalty);
}

/* ---------- ModalVictory ---------- */
function ModalVictory({ stats, onClose }: { stats: GameStats; onClose: () => void }) {
  const score = computeScore(stats);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-[min(90%,640px)] bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-semibold mb-2">{stats.won ? '¡Victoria!' : 'Juego terminado'}</h2>
        <p className="text-sm text-gray-600 mb-4">Resumen del juego</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500">Dificultad</p>
            <p className="font-medium">{stats.difficulty}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Estado</p>
            <p className="font-medium">{stats.won ? 'Ganado' : 'No ganado'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tiempo restante (s)</p>
            <p className="font-medium">{Math.max(0, Math.floor(stats.timeRemaining))}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pistas usadas</p>
            <p className="font-medium">{stats.hintsUsed}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">Score calculado</p>
          <p className="text-3xl font-extrabold">{score}</p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- GameShell: wrapper reusable for each game ---------- */
export function GameShell({
  title,
  defaultParams,
  renderGameContent,
  onFinish,
}: {
  title: string;
  defaultParams?: GameParams;
  renderGameContent: (controls: {
    started: boolean;
    params: GameParams;
    useHint: () => boolean; // returns true if a hint was consumed
    endGame: (won?: boolean) => void; // call to finish game
    ticks: number; // increments every second while playing
  }) => React.ReactNode;
  onFinish?: (stats: GameStats) => void;
}) {
  const [params, setParams] = useState<GameParams>(
    defaultParams ?? { timeSeconds: 60, difficulty: 'medium', hints: 3 }
  );

  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(params.timeSeconds);
  const [hintsLeft, setHintsLeft] = useState<number>(params.hints);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [won, setWon] = useState(false);
  const [ticks, setTicks] = useState(0);

  const timerRef = useRef<number | null>(null);
  const timeStartedAtRef = useRef<number | null>(null);

  // Start game
  function startGame() {
    setTimeLeft(params.timeSeconds);
    setHintsLeft(params.hints);
    setHintsUsed(0);
    setStarted(true);
    setShowModal(false);
    setWon(false);
    setTicks(0);
    timeStartedAtRef.current = Date.now();
  }

  // Use a hint
  function useHint() {
    if (!started) return false;
    if (hintsLeft <= 0) return false;
    setHintsLeft((h) => h - 1);
    setHintsUsed((u) => u + 1);
    return true;
  }

  // End game
  function endGameCallback(didWin = false) {
    if (!started) return;
    setStarted(false);
    setShowModal(true);
    setWon(didWin);

    const now = Date.now();
    const stats: GameStats = {
      timeStartedAt: timeStartedAtRef.current ?? now,
      timeEndedAt: now,
      timeRemaining: timeLeft,
      hintsUsed,
      difficulty: params.difficulty,
      won: didWin,
    };

    if (onFinish) onFinish(stats);
  }

  // Timer effect
  useEffect(() => {
    if (!started) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // time's up
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // finish game as lost
          endGameCallback(false);
          return 0;
        }
        return t - 1;
      });
      setTicks((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Whenever params change while not started, reflect them
  useEffect(() => {
    if (!started) {
      setTimeLeft(params.timeSeconds);
      setHintsLeft(params.hints);
    }
  }, [params, started]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-md p-4">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm text-gray-500">Configura el juego antes de empezar</p>
          </div>

          {!started && (
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Tiempo (s)</label>
                <input
                  type="number"
                  value={params.timeSeconds}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, timeSeconds: Math.max(5, Number(e.target.value) || 5) }))
                  }
                  className="w-20 px-2 py-1 border rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Dificultad</label>
                <select
                  value={params.difficulty}
                  onChange={(e) => setParams((p) => ({ ...p, difficulty: e.target.value as Difficulty }))}
                  className="px-2 py-1 border rounded-lg text-sm"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Medio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Pistas</label>
                <input
                  type="number"
                  value={params.hints}
                  onChange={(e) => setParams((p) => ({ ...p, hints: Math.max(0, Number(e.target.value) || 0) }))}
                  className="w-16 px-2 py-1 border rounded-lg text-sm"
                />
              </div>

              <button
                onClick={startGame}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Jugar
              </button>
            </div>
          )}
        </header>

        <main className="min-h-[240px] bg-gray-50 rounded-lg p-4 flex flex-col">
          {/* Game content rendered by each game */}
          {renderGameContent({
            started,
            params,
            useHint: useHint,
            endGame: endGameCallback,
            ticks,
          })}

          {/* Bottom center controls and bottom-right timer */}
          <div className="mt-auto flex items-center justify-center relative">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-3">
              <button
                onClick={() => {
                  const ok = useHint();
                  // Each individual game can listen to hints via renderGameContent's parameters
                  if (!ok) {
                    // optionally show small feedback; here we just noop
                  }
                }}
                className="px-4 py-2 border rounded-lg bg-white shadow-sm"
              >
                Pista ({hintsLeft})
              </button>

              <button
                onClick={() => endGameCallback(false)}
                className="px-4 py-2 border rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Terminar juego
              </button>
            </div>

            {/* Bottom-right timer + game name */}
            <div className="absolute right-4 bottom-4 flex items-center gap-2">
              <div className="text-xs text-gray-500">{title}</div>
              <div className="px-3 py-1 bg-black text-white rounded-md text-sm font-mono">
                {Math.max(0, Math.floor(timeLeft))}s
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <ModalVictory
          stats={{
            timeStartedAt: timeStartedAtRef.current ?? Date.now(),
            timeEndedAt: Date.now(),
            timeRemaining: timeLeft,
            hintsUsed,
            difficulty: params.difficulty,
            won,
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ---------- Placeholder Games 1..5 ---------- */

// Each game demonstrates how to use GameShell and must export a component.
// When you tell me the 5 specific games, I will replace the placeholder content
// with the real gameplay logic.

import WordSearchGame from '../components/WordSearchGame';

export function GameOne() {
  const words = React.useMemo(() => ['SOL', 'LUNA', 'ESTRELLA', 'MAR', 'NUBE'], []);

  return (
    <GameShell
      title="Juego 1: Sopa de Letras"
      defaultParams={{ timeSeconds: 90, difficulty: 'medium', hints: 2 }}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">Ajusta los parámetros y pulsa Jugar para iniciar la sopa de letras.</p>
          ) : (
            <WordSearchGame
              words={['SOL', 'LUNA', 'ESTRELLA', 'MAR', 'NUBE']}
              size={12}
              onComplete={() => endGame(true)}
            />
          )}
        </div>
      )}
    />
  );
}

import WordConnectGame from '../components/WordConnectGame';

export function GameTwo() {
  return (
    <GameShell
      title="Juego 2: Conecta las Letras"
      defaultParams={{ timeSeconds: 60, difficulty: 'medium', hints: 2 }}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">Une las letras en círculo para formar las palabras correctas.</p>
          ) : (
            <WordConnectGame
              words={['SOL', 'LUNA', 'MAR']}
              onComplete={() => endGame(true)}
            />
          )}
        </div>
      )}
    />
  );
}

import CrosswordGame from '../components/CrosswordGame';

export function GameThree() {
  return (
    <GameShell
      title="Juego 3: Crucigrama"
      defaultParams={{ timeSeconds: 90, difficulty: 'medium', hints: 2 }}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">Completa el crucigrama escribiendo las palabras correctas.</p>
          ) : (
            <CrosswordGame
              onComplete={() => endGame(true)}
              words={[
                { id: 1, word: 'SOL', clue: 'Estrella que ilumina la Tierra' },
                { id: 2, word: 'LUNA', clue: 'Satélite natural de la Tierra' },
                { id: 3, word: 'MAR', clue: 'Gran masa de agua salada' },
                { id: 4, word: 'RIO', clue: 'Corriente natural de agua que fluye hacia el mar' },
                { id: 5, word: 'MONTAÑA', clue: 'Elevación natural del terreno de gran altura' },
                { id: 6, word: 'ARBOL', clue: 'Planta de tronco leñoso que se ramifica a cierta altura' },
                { id: 7, word: 'NUBE', clue: 'Masa visible de vapor de agua suspendida en la atmósfera' },
                { id: 8, word: 'FLOR', clue: 'Parte de la planta que contiene los órganos de reproducción' },
                { id: 9, word: 'FUEGO', clue: 'Fenómeno de combustión que produce luz y calor' },
                { id: 10, word: 'VIENTO', clue: 'Aire en movimiento producido por diferencias de presión' },
                { id: 11, word: 'TIERRA', clue: 'Planeta donde vivimos o superficie firme del planeta' },
                { id: 12, word: 'ARENA', clue: 'Conjunto de pequeñas partículas que cubren playas o desiertos' },
                { id: 13, word: 'LLUVIA', clue: 'Precipitación de gotas de agua desde las nubes' },
                { id: 14, word: 'ESTRELLA', clue: 'Cuerpo celeste que brilla con luz propia' },
                { id: 15, word: 'CAMPO', clue: 'Terreno extenso sin edificar, dedicado al cultivo o pastoreo' },
                { id: 16, word: 'BOSQUE', clue: 'Terreno extenso poblado de árboles y vegetación' },
                { id: 17, word: 'PIEDRA', clue: 'Mineral duro que forma parte de la corteza terrestre' },
                { id: 18, word: 'NIEVE', clue: 'Agua congelada que cae del cielo en forma de copos blancos' },
                { id: 19, word: 'LAGO', clue: 'Gran masa de agua dulce rodeada de tierra' },
                { id: 20, word: 'CIELO', clue: 'Espacio que se extiende sobre nosotros y donde están los astros' },
              ]}
              
            />
          )}
        </div>
      )}
    />
  );
}


import ExplainIt from '../components/ExplainIt';
export function GameFour() {
  return (
    <GameShell
      title="Juego 4: ExplainIt"
      defaultParams={{ timeSeconds: 120, difficulty: 'medium', hints: 1 }}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">
              Explica el concepto que se te indica y presiona "Jugar" para empezar.
            </p>
          ) : (
            <ExplainIt question="¿Puedes explicar sobre la fotosíntesis?" />
          )}
        </div>
      )}
    />
  );
}




export function GameFive() {
  return (
    <GameShell
      title="Juego 5: Reacción"
      defaultParams={{ timeSeconds: 20, difficulty: 'medium', hints: 0 }}
      renderGameContent={({ started, useHint, endGame, ticks }) => {
        // placeholder: win if player clicks within a short random window
        const [canPress, setCanPress] = useState(false);
        const windowRef = useRef<number | null>(null);

        useEffect(() => {
          if (!started) return;
          // every new start schedule a random moment between 3..12s for the press window
          setCanPress(false);
          if (windowRef.current) window.clearTimeout(windowRef.current);
          const when = Math.floor(Math.random() * 9) + 3;
          windowRef.current = window.setTimeout(() => setCanPress(true), when * 1000);
          return () => {
            if (windowRef.current) window.clearTimeout(windowRef.current);
          };
        }, [started]);

        return (
          <div className="p-4">
            {!started ? (
              <p className="text-gray-500">Preparate para reaccionar.</p>
            ) : (
              <div className="space-y-3">
                <p>Presiona el botón cuando aparezca "¡Ahora!"</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => endGame(canPress)}
                    className={`px-4 py-2 rounded-lg ${canPress ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                  >
                    {canPress ? '¡Ahora!' : 'Esperando...'}
                  </button>

                  <button
                    onClick={() => {
                      if (useHint()) alert('Concéntrate en el cambio de color.');
                      else alert('No quedan pistas');
                    }}
                    className="px-3 py-2 border rounded-lg"
                  >
                    Pista
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

/* ---------- Default export: none. We export all games individually ---------- */

// Usage example (in your app):
// import { GameOne, GameTwo, GameThree, GameFour, GameFive } from './React-Game-Components';
// <GameOne />

