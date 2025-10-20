'use client';

import { useState } from 'react';
import PracticeQuestionBox from './components/layout/PracticeQuestionBox';
import type { 
  MultipleChoiceQuestion, 
  TrueFalseQuestion, 
  FillBlankQuestion, 
  ShortAnswerQuestion, 
  RelationshipQuestion, 
  JustificationQuestion 
} from './components/layout/PracticeQuestionBox';
export default function Home() {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Ejemplos de Preguntas
        </h1>
        
        {/* Multiple Choice */}
        <PracticeQuestionBox question={multipleChoiceQuestion} />
        
        {/* True/False */}
        <PracticeQuestionBox question={trueFalseQuestion} />
        
        {/* Fill in the Blank */}
        <PracticeQuestionBox question={fillBlankQuestion} />
        
        {/* Short Answer */}
        <PracticeQuestionBox question={shortAnswerQuestion} />
        
        {/* Relationship */}
        <PracticeQuestionBox question={relationshipQuestion} />
        
        {/* Justification */}
        <PracticeQuestionBox question={justificationQuestion} />
      </div>
    </div>
  );
}