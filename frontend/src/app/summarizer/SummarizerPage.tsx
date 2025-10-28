'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SummaryOptions, { SummaryOptionsData } from '../../components/layout/SummaryOptions';
import PromptInput from '../../components/layout/PromptInput';
import ResponseVisualizer from '../../components/layout/ResponseVisualizer';
import { Api, BASE_URL } from '../../services/api';
import type { SummaryPromptRequest, SummaryPromptOptions, SummaryResponse } from '../../types/SummaryPromptType';

// Small typing effect component for RPG-like feel
const TypingText: React.FC<{ text: string; speed?: number; onStep?: (i: number, ch: string) => void; onDone?: () => void }> = ({ text, speed = 18, onStep, onDone }) => {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    setShown('');
    const id = setInterval(() => {
      i += 1;
      const next = text.slice(0, i);
      setShown(next);
      onStep?.(i, text[i - 1] ?? '');
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onStep, onDone]);
  return <span>{shown}</span>;
};

interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

interface SummarizerPageProps {
  initialResponse?: string;
  title?: string;
  date?: string;
  files?: { name: string; type: string; size: number }[];
}

export default function SummarizerPage({
  initialResponse = '',
  title = 'Nuevo Resumen',
  date,
  files = [],
}: SummarizerPageProps) {
  const [options, setOptions] = useState<SummaryOptionsData>({
    summaryType: null,
    languageRegister: null,
    language: null,
    detailLevel: 2,
    contentFocus: [],
    structure: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [response, setResponse] = useState(initialResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptStep, setShowPromptStep] = useState(false);
  const [focusRect, setFocusRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [promptTypingReset, setPromptTypingReset] = useState(0);

  // First-visit alert only
  useEffect(() => {
    try {
      const key = 'visited:summarizer:v1';
      if (!window.localStorage.getItem(key)) {
        alert('Bienvenido al módulo Summarizer. Aquí podrás subir archivos o texto y obtener un resumen con IA.');
        window.localStorage.setItem(key, '1');
      }
    } catch {
      // no-op
    }
  }, []);

  // Prompt step: only once
  useEffect(() => {
    try {
      const key = 'tour:prompt:v1';
      const seen = window.localStorage.getItem(key);
      if (!seen) {
        setShowPromptStep(true);
        console.log('[tour:prompt] open');
      }
    } catch {}
  }, []);

  // Recompute rect on open/resize/scroll
  useEffect(() => {
    if (!showPromptStep) return;
    const compute = () => {
      const el = document.querySelector('#sp-input') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pad = 12;
      const rect = { x: Math.max(0, r.left - pad), y: Math.max(0, r.top - pad), w: r.width + pad * 2, h: r.height + pad * 2 };
      setFocusRect(rect);
      console.log('[tour:prompt] rect', rect);
    };
    compute();
    const on = () => { console.log('[tour:prompt] recalc'); compute(); };
    window.addEventListener('resize', on);
    window.addEventListener('scroll', on, true);
    // Restart typing on wheel
    const onWheel = () => {
      setPromptTypingReset((n) => n + 1);
      console.log('[tour:prompt] wheel -> restart typing');
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('scroll', on, true);
      window.removeEventListener('wheel', onWheel as any);
    };
  }, [showPromptStep]);

  const closePromptStep = () => {
    try { window.localStorage.setItem('tour:prompt:v1', '1'); } catch {}
    console.log('[tour:prompt] close');
    setShowPromptStep(false);
  };

  // Flag to know if we should hide the PromptInput
  const hasResponse = (response ?? '').trim().length > 0;

  // Preload mock files if provided
  useEffect(() => {
    if (files.length > 0) {
      setUploadedFiles(
        files.map((f, i) => ({
          id: `file-${i}`,
          file: new File([''], f.name, { type: f.type }),
          previewUrl: '',
        }))
      );
    }
  }, [files]);

  const handleFilesChange = (filesList: UploadedFile[]) => setUploadedFiles(filesList);

  // Extract a plain language string from possible object/variants
  const getLanguageName = (lang: unknown): string | undefined => {
    if (typeof lang === 'string') return lang.trim() || undefined;
    if (lang && typeof lang === 'object') {
      const anyLang: any = lang;
      const name = anyLang.title ?? anyLang.name ?? anyLang.label ?? anyLang.value ?? anyLang.code ?? anyLang.id ?? '';
      if (typeof name === 'string' && name.trim()) return name.trim();
    }
    return undefined;
  };

  // Helper: map UI options -> API options
  const mapOptionsToApi = (opts: SummaryOptionsData): SummaryPromptOptions => {
    const focus = new Set((opts.contentFocus ?? []).map((v) => String(v).toLowerCase()));
    return {
      character: typeof opts.summaryType === 'string' ? opts.summaryType : undefined,
      languaje_register: opts.languageRegister ?? undefined,
      language: getLanguageName(opts.language),
      include_references: focus.has('references') || focus.has('referencias') || false,
      include_examples: focus.has('examples') || focus.has('ejemplos') || false,
      include_conclusions: focus.has('conclusions') || focus.has('conclusiones') || false,
    };
  };

  // Helper: slider detail level -> API extension
  const mapDetailLevelToExtension = (lvl: number): string => {
    switch (lvl) {
      case 1:
        return 'short';
      case 3:
        return 'long';
      case 2:
      default:
        return 'medium';
    }
  };

  const handleSendMessage = async (message: string, filesList: UploadedFile[]) => {
    setIsLoading(true);

    console.log('TODO - BASE_URL:', BASE_URL);
    console.log('TODO - options (UI):', options);
    console.log(
      'TODO - files (UI):',
      filesList.map((f) => ({ id: f.id, name: f.file.name, size: f.file.size, type: f.file.type }))
    );

    if (!filesList.length) {
      console.warn('TODO - No hay archivos para enviar.');
      setIsLoading(false);
      return;
    }

    try {
      const apiOptions = mapOptionsToApi(options);
      console.log('TODO - mapped options (API):', apiOptions);
      console.log('TODO - language (string to send):', apiOptions.language);

      const extension = mapDetailLevelToExtension(options.detailLevel);
      console.log('TODO - extension (from slider):', extension);

      const payload: SummaryPromptRequest = {
        files: filesList.map((f) => f.file),
        ...apiOptions,
        extension,
      };

      console.log('TODO - POST URL:', `${BASE_URL}/api/summarize/`);
      console.log('TODO - payload (preview, not FormData yet):', {
        ...apiOptions,
        extension,
        files: Array.from(payload.files).map((f) => ({ name: f.name, size: f.size, type: f.type })),
      });

      const formPreview = Api.buildSummaryFormData(payload as SummaryPromptRequest);
      console.log('TODO - FormData entries:');
      // Note: TS typing for FormData#forEach is loose; cast to any for logging
      (formPreview as any).forEach((value: any, key: string) => {
        if (value instanceof File) {
          console.log('  -', key, { name: value.name, size: value.size, type: value.type });
        } else {
          console.log('  -', key, value);
        }
      });

      const resp = (await Api.summarize(payload)) as SummaryResponse;
      console.log('TODO - response (raw):', resp);

      const data = resp?.summary as any;
      console.log('TODO - parsed.summary:', data?.summary ?? null);
      console.log('TODO - parsed.references:', data?.references ?? null);
      console.log('TODO - parsed.examples:', data?.examples ?? null);
      console.log('TODO - parsed.conclusions:', data?.conclusions ?? null);

      const parts: string[] = [];
      if (data?.summary) parts.push(`# Resumen\n\n${data.summary}`);
      if (Array.isArray(data?.references) && data.references.length) {
        const refs = data.references
          .map((r: any) => `- ${typeof r === 'string' ? r : JSON.stringify(r)}`)
          .join('\n');
        parts.push(`## Referencias\n\n${refs}`);
      }
      if (Array.isArray(data?.examples) && data.examples.length) {
        const exs = data.examples
          .map((e: any) => `- ${typeof e === 'string' ? e : JSON.stringify(e)}`)
          .join('\n');
        parts.push(`## Ejemplos\n\n${exs}`);
      }
      if (data?.conclusions) parts.push(`## Conclusiones\n\n${data.conclusions}`);

      const content = parts.length ? parts.join('\n\n') : JSON.stringify(resp, null, 2);
      console.log('TODO - formatted content for UI:', content);

      setResponse(content);
    } catch (err) {
      console.error('TODO - error:', err);
      try {
        setResponse(String(err));
      } catch {
        setResponse('Error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Prompt-focus overlay */}
      {showPromptStep && focusRect && (
        <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: 'auto' }}>
          {/* Exterior overlays with blur (top, left, right, bottom) */}
          <div
            className="absolute left-0 top-0 w-full"
            style={{ height: focusRect.y, background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={closePromptStep}
          />
          <div
            className="absolute left-0"
            style={{ top: focusRect.y, width: focusRect.x, height: focusRect.h, background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={closePromptStep}
          />
          <div
            className="absolute"
            style={{ top: focusRect.y, left: focusRect.x + focusRect.w, right: 0, height: focusRect.h, background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={closePromptStep}
          />
          <div
            className="absolute left-0"
            style={{ top: focusRect.y + focusRect.h, bottom: 0, width: '100%', background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={closePromptStep}
          />

          {/* Highlight rectangle border */}
          <div
            className="absolute rounded-xl pointer-events-none"
            style={{
              left: focusRect.x,
              top: focusRect.y,
              width: focusRect.w,
              height: focusRect.h,
              boxShadow: '0 0 0 2px rgba(56,189,248,0.9), 0 0 40px rgba(56,189,248,0.35)'
            }}
          />

          {/* Tooltip bubble below the target */}
          <div
            className="absolute max-w-sm p-4 rounded-xl bg-slate-900 text-slate-100 border border-cyan-400/30 shadow-2xl"
            style={{
              left: Math.max(16, Math.min(window.innerWidth - 16 - 320, focusRect.x)),
              top: Math.min(window.innerHeight - 120, focusRect.y + focusRect.h + 12),
            }}
          >
            <div className="text-sm leading-relaxed">
              <TypingText
                key={promptTypingReset}
                text="Este es el área de entrada. Escribe tu texto o arrastra archivos para resumirlos."
                speed={16}
                onStep={(i, ch) => console.log('[tour:prompt] typing', { i, ch })}
                onDone={() => console.log('[tour:prompt] typing done')}
              />
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={closePromptStep}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 font-semibold px-3 py-1.5 shadow ring-1 ring-white/10 hover:from-cyan-300 hover:to-sky-400"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 id="sp-title" className="text-2xl font-bold mb-2">{title}</h1>
        {date && <p className="text-sm text-gray-500">{new Date(date).toLocaleString('es-ES')}</p>}
      </div>

      <div id="sp-visualizer">
        <ResponseVisualizer
          content={response}
          isLoading={isLoading}
          onCopy={() => navigator.clipboard.writeText(response)}
          onRegenerate={() => console.log('Regenerar')}
          onLike={() => console.log('Like')}
          onDislike={() => console.log('Dislike')}
          onExercises={() => console.log('Ejercicios')}
          onFlashcards={() => console.log('Flashcards')}
          onLearningPath={() => console.log('Ruta de aprendizaje')}
        />
      </div>

      {!hasResponse && (
        <div id="sp-input">
          <PromptInput
            placeholder="Escribe texto para resumir o sube archivos..."
            onFilesChange={handleFilesChange}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}

      {!hasResponse && (
        <div id="sp-options">
          <SummaryOptions value={options} onChange={setOptions} />
        </div>
      )}
    </>
  );
}
