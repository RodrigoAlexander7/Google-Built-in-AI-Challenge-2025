'use client';

import { useEffect, useMemo, useState } from 'react';
import PracticeQuestionBox, { type QuestionData } from '@/components/layout/PracticeQuestionBox';
import PromptInput from '@/components/layout/PromptInput';
import PracticeOptions, { PracticeOptionsValue } from '@/components/layout/PracticeOptions';
import { Api } from '@/services/api';
import PracticeGrader, { type UserAnswersMap } from '@/components/layout/PracticeGrader';

// Small typing effect for tour
const TypingText: React.FC<{ text: string; speed?: number; onDone?: () => void; onStep?: (i:number,ch:string)=>void }> = ({ text, speed = 18, onDone, onStep }) => {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0; setShown('');
    const id = setInterval(() => { i++; setShown(text.slice(0, i)); onStep?.(i, text[i-1] ?? ''); if (i >= text.length) { clearInterval(id); onDone?.(); } }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone, onStep]);
  return <span>{shown}</span>;
};

export default function PracticePage() {
  const [practiceOptions, setPracticeOptions] = useState<PracticeOptionsValue>({
    exerciseCount: 4,
    difficulty: 2,
    focusAreas: [],
    questionType: null,
  });

  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswersMap>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);

  // Tour state
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<{x:number;y:number;w:number;h:number}|null>(null);
  const [typingReset, setTypingReset] = useState(0);

  // Steps
  const steps = useMemo(() => [
    { key:'prompt', selector:'#pr-input', text:'Este es el prompt: escribe el tema o pega contenido para crear ejercicios.' },
    { key:'exercises', selector:'#pr-opt-exercises', text:'Elige cuántos ejercicios quieres generar.' },
    { key:'focus', selector:'#pr-opt-focus', text:'Selecciona el área de enfoque: vocabulario, análisis, comprensión o resumen.' },
    { key:'difficulty', selector:'#pr-opt-difficulty', text:'Ajusta la dificultad: Fácil, Medio, Difícil o Extremo.' },
    { key:'question', selector:'#pr-opt-question', text:'Selecciona el tipo de pregunta preferido.' },
  ], []);

  // First-visit only
  useEffect(() => {
    try {
      const k = 'tour:practice:v1';
      if (!localStorage.getItem(k)) { setTourOpen(true); setTourIndex(0); console.log('[practice-tour] start'); }
    } catch {}
  }, []);

  // Compute focus rect, scroll, wheel typing restart
  useEffect(() => {
    if (!tourOpen) return;
    const step = steps[tourIndex]; if (!step) return;
    let skipTimer: number | null = null;
    const compute = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (!el) {
        console.warn('[practice-tour] target not found', step.selector);
        if (skipTimer == null) {
          skipTimer = window.setTimeout(() => {
            console.warn('[practice-tour] auto-skip step', step.key);
            setTourIndex((i)=>Math.min(i+1, steps.length-1));
          }, 400);
        }
        return;
      }
      if (skipTimer) { clearTimeout(skipTimer); skipTimer = null; }
      const r = el.getBoundingClientRect(); const pad = 12;
      setFocusRect({ x: Math.max(0, r.left - pad), y: Math.max(0, r.top - pad), w: r.width + pad*2, h: r.height + pad*2 });
      console.log('[practice-tour] rect', step.key);
    };
    const el2 = document.querySelector(step.selector) as HTMLElement | null; if (el2) { try { el2.scrollIntoView({ behavior:'smooth', block:'center' }); } catch {} }
    compute();
    const on = () => { console.log('[practice-tour] recalc', step.key); compute(); };
    window.addEventListener('resize', on); window.addEventListener('scroll', on, true);
    const onWheel = () => { setTypingReset(n=>n+1); console.log('[practice-tour] wheel -> restart typing'); };
    window.addEventListener('wheel', onWheel, { passive:true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); console.log('[practice-tour] key next'); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); console.log('[practice-tour] key prev'); prev(); }
      else if (e.key === 'Escape') { e.preventDefault(); console.log('[practice-tour] key skip'); skip(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { if (skipTimer) clearTimeout(skipTimer); window.removeEventListener('resize', on); window.removeEventListener('scroll', on, true); window.removeEventListener('wheel', onWheel as any); window.removeEventListener('keydown', onKey); };
  }, [tourOpen, tourIndex, steps]);

  const next = () => { setTypingReset(n=>n+1); setTourIndex(i => { const nx = i+1; if (nx >= steps.length) { try{localStorage.setItem('tour:practice:v1','done');}catch{} setTourOpen(false); console.log('[practice-tour] done'); return i; } console.log('[practice-tour] next ->', steps[nx].key); return nx; }); };
  const prev = () => setTourIndex(i => Math.max(0, i-1));
  const skip = () => { try{localStorage.setItem('tour:practice:v1','done');}catch{} setTourOpen(false); };

  // Local mirror of PromptInput's UploadedFile
  type UploadedFile = { id: string; file: File; previewUrl?: string };

  const mapDifficulty = (d: PracticeOptionsValue['difficulty']): string => {
    switch (d) {
      case 1: return 'easy';
      case 2: return 'medium';
      case 3: return 'hard';
      case 4: return 'extreme';
      default: return 'medium';
    }
  };

  const mapQuestionTypeToApi = (qt: PracticeOptionsValue['questionType'] | null): string => {
    switch (qt) {
      case 'multiple-choice': return 'multiple_choice';
      case 'true-false': return 'true_false';
      case 'fill-blank': return 'fill_in_the_blank';
      case 'short-answer': return 'short_answer';
      case 'relationship': return 'matching';
      // 'justification' not supported on backend; fallback
      default: return 'multiple_choice';
    }
  };

  const toQuestionData = (raw: any, requestedType: PracticeOptionsValue['questionType'] | null, index: number): QuestionData => {
    const qText = (raw?.statement ?? raw?.question ?? 'Pregunta') as string;
    const base = {
      id: `q_${Date.now()}_${index}`,
      question: qText,
      points: undefined as number | undefined,
    } as any;

    // Prefer the requested type mapping, fallback to multiple-choice using choices
    const choices: Array<{ text: string; is_correct?: boolean }> = Array.isArray(raw?.choices) ? raw.choices : [];
    const correctIndex = Math.max(0, choices.findIndex(c => c?.is_correct));

    switch (requestedType) {
      case 'true-false': {
        // Prefer backend boolean when provided
        if (typeof raw?.is_true === 'boolean') {
          return { ...base, type: 'true-false', correctAnswer: !!raw.is_true } as QuestionData;
        }
        // Otherwise infer from choices if available
        let correct = false;
        if (choices.length === 2) {
          const ci = choices.findIndex(c => c?.is_correct);
          const txt = (choices[ci]?.text || '').toLowerCase();
          if (/(true|verdadero)/.test(txt)) correct = true;
          else if (/(false|falso)/.test(txt)) correct = false;
          else correct = ci === 0;
        }
        return { ...base, type: 'true-false', correctAnswer: correct } as QuestionData;
      }
      case 'fill-blank': {
        const correctText = (choices.find(c => c.is_correct)?.text ?? '').trim();
        return { ...base, type: 'fill-blank', blanks: 1, correctAnswers: [correctText] } as QuestionData;
      }
      case 'short-answer': {
        const correctText = (choices.find(c => c.is_correct)?.text ?? raw?.explanation ?? '').trim();
        return { ...base, type: 'short-answer', correctAnswer: correctText, maxLength: 200 } as QuestionData;
      }
      case 'relationship': {
        // Backend returns matching pairs structure unknown; present placeholder using choices
        const items = choices.map((c, i) => `Ítem ${i + 1}`);
        const concepts = choices.map(c => c.text);
        const correctPairs: [number, number][] = choices.map((_, i) => [i, i]);
        return { ...base, type: 'relationship', items, concepts, correctPairs } as QuestionData;
      }
      case 'multiple-choice':
      default: {
        const options = choices.length ? choices.map(c => c.text) : [];
        const corr = correctIndex >= 0 ? correctIndex : 0;
        return { ...base, type: 'multiple-choice', options, correctAnswer: corr } as QuestionData;
      }
    }
  };

  const handleSendMessage = async (message: string, files: UploadedFile[]) => {
    setIsLoading(true);
    setError(null);
    setResponse('');
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);
    setScore(undefined);
    try {
      const usesFiles = Array.isArray(files) && files.length > 0;
      const exercises_types = mapQuestionTypeToApi(practiceOptions.questionType);
      const exercises_difficulty = mapDifficulty(practiceOptions.difficulty);
      const exercises_count = practiceOptions.exerciseCount;

      let data: any;
      if (usesFiles) {
        data = await Api.generateExercisesFromFiles({
          files: files.map(f => f.file),
          exercises_count,
          exercises_difficulty,
          exercises_types,
        });
      } else {
        data = await Api.generateExercisesByTopic({
          topic: message || 'General',
          exercises_count,
          exercises_difficulty,
          exercises_types,
        });
      }

      console.log('[practice] API response:', data);
      const list: any[] = data?.exercises?.exercises ?? [];
      if (!Array.isArray(list) || list.length === 0) {
        setResponse('No se recibieron ejercicios. Intenta con otros parámetros.');
      } else {
        const mapped = list.map((it, i) => toQuestionData(it, practiceOptions.questionType, i));
        setQuestions(mapped);
      }
    } catch (e: any) {
      console.error('[practice] error', e);
      setError(e?.message || 'Error al generar ejercicios');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Guided tour overlay */}
      {tourOpen && focusRect && (
        <div className="fixed inset-0 z-[9999]">
          {/* exterior blur panels */}
          <div className="absolute left-0 top-0 w-full" style={{height:focusRect.y, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute left-0" style={{top:focusRect.y, width:focusRect.x, height:focusRect.h, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute" style={{top:focusRect.y, left:focusRect.x+focusRect.w, right:0, height:focusRect.h, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute left-0" style={{top:focusRect.y+focusRect.h, bottom:0, width:'100%', background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          {/* highlight */}
          <div className="absolute rounded-xl pointer-events-none" style={{left:focusRect.x, top:focusRect.y, width:focusRect.w, height:focusRect.h, boxShadow:'0 0 0 2px rgba(56,189,248,0.9), 0 0 40px rgba(56,189,248,0.35)'}}/>
          {/* bubble */}
          <div className="absolute max-w-sm p-4 rounded-xl bg-slate-900 text-slate-100 border border-cyan-400/30 shadow-2xl" style={{left: Math.max(16, Math.min(window.innerWidth - 336, focusRect.x)), top: Math.min(window.innerHeight - 140, focusRect.y + focusRect.h + 12)}}>
            <div className="text-xs text-cyan-300 mb-1">Paso {tourIndex+1} de {steps.length}</div>
            <div className="text-sm leading-relaxed">
              <TypingText key={typingReset + tourIndex*1000} text={steps[tourIndex].text} speed={16} onStep={(i,ch)=>console.log('[practice-tour] typing',{i,ch})}/>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button onClick={prev} disabled={tourIndex===0} className="inline-flex items-center gap-2 rounded-md text-slate-300 hover:text-white px-3 py-1.5">Atrás</button>
              <div className="flex items-center gap-2">
                <button onClick={skip} className="inline-flex items-center gap-2 rounded-md text-slate-300 hover:text-white px-3 py-1.5">Saltar</button>
                <button onClick={next} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 font-semibold px-3 py-1.5 shadow ring-1 ring-white/10 hover:from-cyan-300 hover:to-sky-400">{tourIndex < steps.length-1 ? 'Siguiente' : 'Entendido'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Nueva práctica</h1>
      <p className="text-center text-gray-500 mb-8">Configura y genera tus ejercicios personalizados.</p>
      {questions.length === 0 && (
        <>
          <div className="mt-10" id="pr-input">
            <PromptInput
              placeholder="Escribe el texto o tema para generar ejercicios..."
              onSendMessage={handleSendMessage}
            />
          </div>
          <PracticeOptions value={practiceOptions} onChange={setPracticeOptions} />
        </>
      )}

      {isLoading && (
        <div className="flex justify-center mt-6" aria-label="Cargando preguntas">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      )}
      {error && <p className="text-center text-red-600 mt-2">{error}</p>}

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Resultado:</h3>
          <p className="text-gray-700">{response}</p>
        </div>
      )}

      {questions.length > 0 && (
        <>
          <div className="mt-6 space-y-5">
            {questions.map((q) => (
              <PracticeQuestionBox
                key={q.id}
                question={q}
                showResults={showResults}
                onAnswer={(ans) => setUserAnswers(prev => ({ ...prev, [q.id]: ans }))}
              />
            ))}
          </div>

          <PracticeGrader
            questions={questions}
            userAnswers={userAnswers}
            isGraded={showResults}
            score={score}
            onGrade={(s, _t) => { setScore(s); setShowResults(true); }}
          />
        </>
      )}
    </div>
  );
}
