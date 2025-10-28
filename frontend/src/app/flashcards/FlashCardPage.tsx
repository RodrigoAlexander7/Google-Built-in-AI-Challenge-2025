'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FlashCardContainer from "../../components/layout/FlashCardContainer";
import PromptInput from "../../components/layout/PromptInput";
import FlashCardOption, { FlashCardOptionsValue } from "../../components/layout/FlashCardOption";

// Typing effect reused
const TypingText: React.FC<{ text: string; speed?: number; onStep?: (i:number,ch:string)=>void }> = ({ text, speed = 16, onStep }) => {
  const [shown, setShown] = useState('');
  useEffect(() => { let i=0; setShown(''); const id = setInterval(()=>{ i++; setShown(text.slice(0,i)); onStep?.(i, text[i-1]??''); if(i>=text.length) clearInterval(id); }, speed); return ()=>clearInterval(id); }, [text, speed, onStep]);
  return <span>{shown}</span>;
};

export default function FlashCardPage() {
  const [options, setOptions] = useState<FlashCardOptionsValue>({
    count: 8,
    complexity: 2,
    focuses: ['conceptos', 'definiciones']
  });

  // Tour state
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<{x:number;y:number;w:number;h:number}|null>(null);
  const [typingReset, setTypingReset] = useState(0);

  const steps = useMemo(() => [
    { key:'prompt', selector:'#fc-prompt', text:'Este es el prompt para generar tus flashcards.' },
    { key:'count', selector:'#fc-opt-count', text:'Elige cuántas tarjetas quieres en esta sesión.' },
    { key:'complexity', selector:'#fc-opt-complexity', text:'Ajusta la complejidad: Básico, Intermedio o Avanzado.' },
    { key:'focus', selector:'#fc-opt-focus', text:'Selecciona en qué enfocarte: vocabulario, conceptos, definiciones, etc.' },
    { key:'container', selector:'#fc-container', text:'Aquí verás y manejarás tus flashcards.' },
  ], []);

  useEffect(() => {
    try { const k='tour:flashcards:v1'; if(!localStorage.getItem(k)){ setTourOpen(true); setTourIndex(0); console.log('[fc-tour] start'); } } catch {}
  }, []);

  useEffect(() => {
    if (!tourOpen) return; const step = steps[tourIndex]; if (!step) return;
    let skipTimer: number | null = null;
    const compute = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (!el) { console.warn('[fc-tour] target not found', step.selector); if (skipTimer == null){ skipTimer = window.setTimeout(()=> setTourIndex(i=>Math.min(i+1, steps.length-1)), 400);} return; }
      if (skipTimer) { clearTimeout(skipTimer); skipTimer = null; }
      const r = el.getBoundingClientRect(); const pad=12;
      setFocusRect({ x: Math.max(0, r.left-pad), y: Math.max(0, r.top-pad), w: r.width+pad*2, h: r.height+pad*2 });
      try { el.scrollIntoView({ behavior:'smooth', block:'center' }); } catch {}
    };
    compute();
    const on = () => compute();
    window.addEventListener('resize', on); window.addEventListener('scroll', on, true);
    const onWheel = () => { setTypingReset(n=>n+1); console.log('[fc-tour] wheel -> restart typing'); };
    window.addEventListener('wheel', onWheel, { passive:true });
    const onKey = (e: KeyboardEvent) => { if(e.key==='ArrowRight'||e.key==='Enter'){ e.preventDefault(); setTypingReset(n=>n+1); next(); } else if(e.key==='ArrowLeft'){ e.preventDefault(); setTourIndex(i=>Math.max(0,i-1)); } else if(e.key==='Escape'){ e.preventDefault(); skip(); } };
    window.addEventListener('keydown', onKey);
    return () => { if (skipTimer) clearTimeout(skipTimer); window.removeEventListener('resize', on); window.removeEventListener('scroll', on, true); window.removeEventListener('wheel', onWheel as any); window.removeEventListener('keydown', onKey); };
  }, [tourOpen, tourIndex, steps]);

  const next = () => { setTourIndex(i=>{ const nx=i+1; if(nx>=steps.length){ try{localStorage.setItem('tour:flashcards:v1','done');}catch{} setTourOpen(false); console.log('[fc-tour] done'); return i; } console.log('[fc-tour] next ->', steps[nx].key); return nx; }); };
  const skip = () => { try{localStorage.setItem('tour:flashcards:v1','done');}catch{} setTourOpen(false); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Tour overlay */}
      {tourOpen && focusRect && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute left-0 top-0 w-full" style={{height:focusRect.y, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute left-0" style={{top:focusRect.y, width:focusRect.x, height:focusRect.h, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute" style={{top:focusRect.y, left:focusRect.x+focusRect.w, right:0, height:focusRect.h, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute left-0" style={{top:focusRect.y+focusRect.h, bottom:0, width:'100%', background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute rounded-xl pointer-events-none" style={{left:focusRect.x, top:focusRect.y, width:focusRect.w, height:focusRect.h, boxShadow:'0 0 0 2px rgba(56,189,248,0.9), 0 0 40px rgba(56,189,248,0.35)'}}/>
          <div className="absolute max-w-sm p-4 rounded-xl bg-slate-900 text-slate-100 border border-cyan-400/30 shadow-2xl" style={{left: Math.max(16, Math.min(window.innerWidth - 336, focusRect.x)), top: Math.min(window.innerHeight - 140, focusRect.y + focusRect.h + 12)}}>
            <div className="text-xs text-cyan-300 mb-1">Paso {tourIndex+1} de {steps.length}</div>
            <div className="text-sm leading-relaxed">
              <TypingText key={typingReset + tourIndex*1000} text={steps[tourIndex].text} speed={16} onStep={(i,ch)=>console.log('[fc-tour] typing',{i,ch})}/>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={skip} className="inline-flex items-center gap-2 rounded-md text-slate-300 hover:text-white px-3 py-1.5">Saltar</button>
              <button onClick={next} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 font-semibold px-3 py-1.5 shadow ring-1 ring-white/10 hover:from-cyan-300 hover:to-sky-400">{tourIndex < steps.length-1 ? 'Siguiente' : 'Entendido'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Visualizador de Flashcards */}
        <FlashCardContainer />

        {/* Prompt Input */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-2xl p-4" id="fc-prompt">
          <PromptInput
            placeholder="Describe el tipo de tarjetas que quieres generar..."
            onSendMessage={(message) => {
              console.log('Prompt enviado:', { message, options });
            }}
          />
        </div>

        {/* Opciones de configuración */}
        <FlashCardOption value={options} onChange={setOptions} />
      </div>
    </div>
  );
}