'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SummaryOptions, { SummaryOptionsData } from '../../components/layout/SummaryOptions';
import PromptInput from '../../components/layout/PromptInput';
import ResponseVisualizer from '../../components/layout/ResponseVisualizer';
import { Api, BASE_URL } from '../../services/api';
import type { SummaryPromptRequest, SummaryPromptOptions, SummaryResponse } from '../../types/SummaryPromptType';

// Small typing effect component for RPG-like feel
const TypingText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 18 }) => {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    setShown('');
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
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
