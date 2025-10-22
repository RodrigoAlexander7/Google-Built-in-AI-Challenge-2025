'use client';

import React, { useState } from 'react';
import FlashCardContainer from "../../components/layout/FlashCardContainer";
import PromptInput from "../../components/layout/PromptInput";
import FlashCardOption, { FlashCardOptionsValue } from "../../components/layout/FlashCardOption";

export default function FlashCardPage() {
  const [options, setOptions] = useState<FlashCardOptionsValue>({
    count: 8,
    complexity: 2,
    focuses: ['conceptos', 'definiciones']
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Visualizador de Flashcards */}
        <FlashCardContainer />

        {/* Prompt Input */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-2xl p-4">
          <PromptInput
            placeholder="Describe el tipo de tarjetas que quieres generar..."
            onSendMessage={(message) => {
              // ...conectar al generador en el futuro...
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