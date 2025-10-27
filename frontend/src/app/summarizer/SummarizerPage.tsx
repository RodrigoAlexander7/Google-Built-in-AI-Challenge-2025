'use client';
import React, { useState, useEffect } from 'react';
import SummaryOptions, { SummaryOptionsData } from '../../components/layout/SummaryOptions';
import PromptInput from '../../components/layout/PromptInput';
import ResponseVisualizer from '../../components/layout/ResponseVisualizer';
import { Api, BASE_URL } from '../../services/api';
import type { SummaryPromptRequest, SummaryPromptOptions } from '../../types/SummaryPromptType';

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
  files = []
}: SummarizerPageProps) {
  const [options, setOptions] = useState<SummaryOptionsData>({
    summaryType: null,
    languageRegister: null,
    language: null,
    detailLevel: 2,
    contentFocus: [],
    structure: []
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [response, setResponse] = useState(initialResponse);
  const [isLoading, setIsLoading] = useState(false);

  // Cuando se pasa contenido inicial (desde mock o localStorage)
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

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  // Helper: map UI options -> API options
  const mapOptionsToApi = (opts: SummaryOptionsData): SummaryPromptOptions => {
    return {
      // character: typeof opts.summaryType === 'string' ? opts.summaryType : undefined, // opcional
      languaje_register: opts.languageRegister ?? undefined,
      language: opts.language ?? undefined,
      // extension: undefined, // define si aplica
      // include_references: Array.isArray(opts.contentFocus) ? opts.contentFocus.includes('references') : undefined,
      // include_examples: Array.isArray(opts.contentFocus) ? opts.contentFocus.includes('examples') : undefined,
      // include_conclusions: Array.isArray(opts.contentFocus) ? opts.contentFocus.includes('conclusions') : undefined,
    };
  };

  const handleSendMessage = async (message: string, files: UploadedFile[]) => {
    setIsLoading(true);

    // Logs: show everything
    console.log('TODO - BASE_URL:', BASE_URL);
    console.log('TODO - options (UI):', options);
    console.log('TODO - files (UI):', files.map(f => ({ id: f.id, name: f.file.name, size: f.file.size, type: f.file.type })));

    if (!files.length) {
      console.warn('TODO - No hay archivos para enviar.');
      setIsLoading(false);
      return;
    }

    try {
      const apiOptions = mapOptionsToApi(options);
      console.log('TODO - mapped options (API):', apiOptions);

      const payload: SummaryPromptRequest = {
        files: files.map(f => f.file),
        ...apiOptions,
        // prompt: message, // NO ENVIAR: no definido por el API en este momento
      };

      console.log('TODO - POST URL:', `${BASE_URL}/api/summarize/`);
      console.log('TODO - payload (preview):', {
        ...apiOptions,
        files: payload.files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      });

      const resp = await Api.summarize(payload);
      console.log('TODO - response:', resp);

      const text = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2);
      setResponse(text);
    } catch (err) {
      console.error('TODO - error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-8xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {date && <p className="text-sm text-gray-500">{new Date(date).toLocaleString('es-ES')}</p>}
      </div>

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

      <PromptInput
        placeholder="Escribe texto para resumir o sube archivos..."
        onFilesChange={handleFilesChange}
        onSendMessage={handleSendMessage}
      />

      <SummaryOptions value={options} onChange={setOptions} />
    </div>
  );
}
