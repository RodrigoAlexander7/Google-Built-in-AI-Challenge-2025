'use client';

import { useState } from 'react';
import PracticeQuestionBox from '../../components/layout/PracticeQuestionBox';
import PromptInput from '../../components/layout/PromptInput';
import PracticeOptions, { PracticeOptionsValue } from '../../components/layout/PracticeOptions';
import type { 
  MultipleChoiceQuestion, 
  TrueFalseQuestion, 
  FillBlankQuestion, 
  ShortAnswerQuestion, 
  RelationshipQuestion, 
  JustificationQuestion 
} from '../../components/layout/PracticeQuestionBox';

const DIFFICULTY_LABELS: Record<PracticeOptionsValue['difficulty'], string> = {
  1: 'Fácil',
  2: 'Medio',
  3: 'Difícil',
  4: 'Extremo',
};

const QUESTION_TYPE_LABELS: Record<NonNullable<PracticeOptionsValue['questionType']>, string> = {
  'multiple-choice': 'Opción múltiple',
  'true-false': 'Verdadero/Falso',
  'fill-blank': 'Espacio en blanco',
  'short-answer': 'Respuesta corta',
  'relationship': 'Relacionar',
  'justification': 'Justificación',
};

interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

export default function Practice() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [practiceOptions, setPracticeOptions] = useState<PracticeOptionsValue>({
    exerciseCount: 4,
    difficulty: 2,
    focusAreas: [],
    questionType: null,
  });

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    console.log('Archivos subidos:', files);
  };

  const handleSendMessage = async (message: string, files?: UploadedFile[]) => {
    setIsLoading(true);
    const usedFiles = files ?? uploadedFiles;

    const configText = [
      `- Número de ejercicios: ${practiceOptions.exerciseCount}`,
      `- Nivel de dificultad: ${DIFFICULTY_LABELS[practiceOptions.difficulty]}`,
      `- Área(s) de enfoque: ${practiceOptions.focusAreas.length ? practiceOptions.focusAreas.join(', ') : 'General'}`,
      `- Tipo de pregunta: ${practiceOptions.questionType ? QUESTION_TYPE_LABELS[practiceOptions.questionType] : 'Mixto'}`,
    ].join('\n');

    const filesText = usedFiles.length ? `\nArchivos adjuntos: ${usedFiles.map(f => f.file.name).join(', ')}` : '';

    // Simular una respuesta con la configuración seleccionada
    setTimeout(() => {
      setResponse(
        `¡Estas son las preguntas que generaría con tu configuración!\n\n` +
        `Configuración seleccionada:\n${configText}\n\n` +
        `Prompt recibido: "${message || 'Sin prompt'}"${filesText}\n\n` +
        `Nota: Este es un ejemplo de respuesta. Aquí se generarán ${practiceOptions.exerciseCount} preguntas acorde a tu configuración.`
      );
      setIsLoading(false);
    }, 700);
  };

  // Ejemplo Multiple Choice
  const multipleChoiceQuestion: MultipleChoiceQuestion = {
    id: '1',
    type: 'multiple-choice',
    question: '¿Cuál de los siguientes lenguajes es de tipado estático?',
    options: ['JavaScript', 'Python', 'TypeScript', 'Ruby'],
    correctAnswer: 2,
    points: 5
  };

  // Ejemplo True/False
  const trueFalseQuestion: TrueFalseQuestion = {
    id: '2',
    type: 'true-false',
    question: 'React fue creado por Facebook',
    correctAnswer: true,
    points: 3
  };

  // Ejemplo Fill in the Blank
  const fillBlankQuestion: FillBlankQuestion = {
    id: '3',
    type: 'fill-blank',
    question: 'React usa un DOM ________ para optimizar las actualizaciones mediante ________.',
    blanks: 2,
    correctAnswers: ['virtual', 'reconciliación'],
    points: 4
  };

  // Ejemplo Short Answer
  const shortAnswerQuestion: ShortAnswerQuestion = {
    id: '4',
    type: 'short-answer',
    question: 'Explica brevemente qué es el Virtual DOM en React',
    correctAnswer: 'Es una representación en memoria del DOM real que permite actualizaciones eficientes',
    maxLength: 200,
    points: 6
  };

  // Ejemplo Relationship
  const relationshipQuestion: RelationshipQuestion = {
    id: '5',
    type: 'relationship',
    question: 'Relaciona cada concepto con su definición:',
    items: ['Hook', 'Componente', 'Estado', 'Props'],
    concepts: [
      'Función que permite usar estado y otras características de React',
      'Función o clase que retorna elementos de React',
      'Datos que determinan el comportamiento y renderizado',
      'Datos pasados de un componente padre a hijo'
    ],
    correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
    points: 8
  };

  // Ejemplo Justification
  const justificationQuestion: JustificationQuestion = {
    id: '6',
    type: 'justification',
    question: '¿Es React un framework?',
    statement: 'React es considerado un framework de JavaScript',
    correctAnswer: false,
    justification: 'React es una biblioteca, no un framework, porque se enfoca específicamente en la interfaz de usuario y puede ser integrado con otras herramientas',
    points: 5
  };

  return (
    <div>
      <div className="max-w-12xl mx-auto space-y-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Ejemplos de Preguntas
        </h1>
        <p className="text-center text-gray-500 mb-6">Configura y prueba la generación de ejercicios</p>

        {/* Opciones de práctica */}
        <PracticeOptions value={practiceOptions} onChange={setPracticeOptions} />

        {/* Ejemplos */}
        <PracticeQuestionBox question={multipleChoiceQuestion} />
        <PracticeQuestionBox question={trueFalseQuestion} />
        <PracticeQuestionBox question={fillBlankQuestion} />
        <PracticeQuestionBox question={shortAnswerQuestion} />
        <PracticeQuestionBox question={relationshipQuestion} />
        <PracticeQuestionBox question={justificationQuestion} />
      </div>

      {/* Prompt + Respuesta */}
      <div className="max-w-10xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Prueba el Prompt
        </h2>
        <div className="mb-6">
          <PromptInput
            placeholder="Escribe el texto que quieres practicar o sube archivos..."
            onFilesChange={handleFilesChange}
            onSendMessage={handleSendMessage}
          />
        </div>

        {isLoading && (
          <div className="text-center text-gray-600">Cargando...</div>
        )}

        {response && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Resultado:</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}