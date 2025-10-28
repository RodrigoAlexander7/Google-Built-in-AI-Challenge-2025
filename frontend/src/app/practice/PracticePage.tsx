'use client';

import { useEffect, useMemo, useState } from 'react';
import PracticeQuestionBox from '@/components/layout/PracticeQuestionBox';
import PromptInput from '@/components/layout/PromptInput';
import PracticeOptions, { PracticeOptionsValue } from '@/components/layout/PracticeOptions';

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
    const compute = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (!el) { console.warn('[practice-tour] target not found', step.selector); return; }
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
    return () => { window.removeEventListener('resize', on); window.removeEventListener('scroll', on, true); window.removeEventListener('wheel', onWheel as any); };
  }, [tourOpen, tourIndex, steps]);

  const next = () => { setTypingReset(n=>n+1); setTourIndex(i => { const nx = i+1; if (nx >= steps.length) { try{localStorage.setItem('tour:practice:v1','done');}catch{} setTourOpen(false); console.log('[practice-tour] done'); return i; } console.log('[practice-tour] next ->', steps[nx].key); return nx; }); };
  const prev = () => setTourIndex(i => Math.max(0, i-1));
  const skip = () => { try{localStorage.setItem('tour:practice:v1','done');}catch{} setTourOpen(false); };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setResponse(`Generando práctica basada en: "${message}"`);
      setIsLoading(false);
    }, 700);
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
      <div className="mt-10" id="pr-input">
        <PromptInput
          placeholder="Escribe el texto o tema para generar ejercicios..."
          onSendMessage={handleSendMessage}
        />
      </div>
      <PracticeOptions value={practiceOptions} onChange={setPracticeOptions} />

      {isLoading && <p className="text-center text-gray-600 mt-4">Cargando preguntas...</p>}

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Resultado:</h3>
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
}
