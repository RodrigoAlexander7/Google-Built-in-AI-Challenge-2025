'use client';
import React, { useState, useEffect } from 'react';
import SummaryOptions, { SummaryOptionsData } from '../../components/layout/SummaryOptions';
import PromptInput from '../../components/layout/PromptInput';
import ResponseVisualizer from '../../components/layout/ResponseVisualizer';

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

  const handleSendMessage = async (message: string, files: UploadedFile[]) => {
    setIsLoading(true);
    setTimeout(() => {
      const mockResponse = `# Resumen generado\n\n${message}`;
      setResponse(mockResponse);
      setIsLoading(false);
    }, 1200);
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
