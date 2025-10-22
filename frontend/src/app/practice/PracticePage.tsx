'use client';

import { useState } from 'react';
import PracticeQuestionBox from '@/components/layout/PracticeQuestionBox';
import PromptInput from '@/components/layout/PromptInput';
import PracticeOptions, { PracticeOptionsValue } from '@/components/layout/PracticeOptions';

export default function PracticePage() {
  const [practiceOptions, setPracticeOptions] = useState<PracticeOptionsValue>({
    exerciseCount: 4,
    difficulty: 2,
    focusAreas: [],
    questionType: null,
  });

  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setResponse(`Generando práctica basada en: "${message}"`);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Nueva práctica</h1>
      <p className="text-center text-gray-500 mb-8">
        Configura y genera tus ejercicios personalizados.
      </p>

      <PracticeOptions value={practiceOptions} onChange={setPracticeOptions} />

      <div className="mt-10">
        <PromptInput
          placeholder="Escribe el texto o tema para generar ejercicios..."
          onSendMessage={handleSendMessage}
        />
      </div>

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
