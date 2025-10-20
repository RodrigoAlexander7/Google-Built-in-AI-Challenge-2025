import React, { useState } from 'react';

// Tipos de pregunta
export type QuestionType = 
  | 'multiple-choice' 
  | 'true-false' 
  | 'fill-blank' 
  | 'short-answer' 
  | 'relationship' 
  | 'justification';

// Interfaces para los datos de cada tipo de pregunta
interface BaseQuestion {
  id: string;
  question: string;
  points?: number;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number; // índice de la opción correcta
}

interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  blanks: number; // número de espacios en blanco
  correctAnswers: string[]; // respuestas para cada espacio
}

interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  correctAnswer: string;
  maxLength?: number;
}

interface RelationshipQuestion extends BaseQuestion {
  type: 'relationship';
  items: string[];
  concepts: string[];
  correctPairs: [number, number][]; // [índice_item, índice_concepto]
}

interface JustificationQuestion extends BaseQuestion {
  type: 'justification';
  statement: string;
  correctAnswer: boolean;
  justification: string;
}

type QuestionData = 
  | MultipleChoiceQuestion 
  | TrueFalseQuestion 
  | FillBlankQuestion 
  | ShortAnswerQuestion 
  | RelationshipQuestion 
  | JustificationQuestion;

interface QuestionBoxProps {
  question: QuestionData;
  onAnswer?: (answer: any) => void;
  showResults?: boolean;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ 
  question, 
  onAnswer, 
  showResults = false 
}) => {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>([]);
  const [relationshipPairs, setRelationshipPairs] = useState<[number, number][]>([]);

  const handleAnswer = (answer: any) => {
    setUserAnswer(answer);
    onAnswer?.(answer);
  };

  const handleFillBlankChange = (index: number, value: string) => {
    const newAnswers = [...fillBlankAnswers];
    newAnswers[index] = value;
    setFillBlankAnswers(newAnswers);
    handleAnswer(newAnswers);
  };

  const handleRelationshipPair = (itemIndex: number, conceptIndex: number) => {
    const newPairs = relationshipPairs.filter(pair => pair[0] !== itemIndex);
    newPairs.push([itemIndex, conceptIndex]);
    setRelationshipPairs(newPairs);
    handleAnswer(newPairs);
  };

  const getAnswerStatus = (isCorrect: boolean) => {
    if (!showResults) return '';
    return isCorrect 
      ? 'border-2 border-green-500 bg-green-50' 
      : 'border-2 border-red-500 bg-red-50';
  };

  // Renderizado de Multiple Choice
  const renderMultipleChoice = (question: MultipleChoiceQuestion) => {
    return (
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full p-4 text-left rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 ${
              userAnswer === index ? 'border-2 border-blue-500 bg-blue-50' : ''
            } ${showResults ? getAnswerStatus(index === question.correctAnswer) : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                userAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              } ${showResults && index === question.correctAnswer ? 'border-green-500 bg-green-500' : ''}`}>
                {userAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-800">{option}</span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Renderizado de True/False
  const renderTrueFalse = (question: TrueFalseQuestion) => {
    return (
      <div className="flex space-x-4">
        <button
          onClick={() => handleAnswer(true)}
          className={`flex-1 p-6 rounded-xl bg-white border-2 transition-all duration-200 ${
            userAnswer === true 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          } ${showResults ? getAnswerStatus(true === question.correctAnswer) : ''}`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">✓</div>
            <span className="text-gray-700 font-medium">Verdadero</span>
          </div>
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className={`flex-1 p-6 rounded-xl bg-white border-2 transition-all duration-200 ${
            userAnswer === false 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          } ${showResults ? getAnswerStatus(false === question.correctAnswer) : ''}`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">✗</div>
            <span className="text-gray-700 font-medium">Falso</span>
          </div>
        </button>
      </div>
    );
  };

  // Renderizado de Fill in the Blank
  const renderFillBlank = (question: FillBlankQuestion) => {
    return (
      <div className="space-y-4">
        {Array.from({ length: question.blanks }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">{index + 1}.</span>
            <input
              type="text"
              value={fillBlankAnswers[index] || ''}
              onChange={(e) => handleFillBlankChange(index, e.target.value)}
              className={`flex-1 p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                showResults 
                  ? getAnswerStatus(
                      fillBlankAnswers[index]?.toLowerCase() === 
                      question.correctAnswers[index]?.toLowerCase()
                    )
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              placeholder={`Respuesta ${index + 1}`}
            />
          </div>
        ))}
      </div>
    );
  };

  // Renderizado de Short Answer
  const renderShortAnswer = (question: ShortAnswerQuestion) => {
    return (
      <textarea
        value={userAnswer || ''}
        onChange={(e) => handleAnswer(e.target.value)}
        className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 ${
          showResults 
            ? getAnswerStatus(userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase())
            : 'border-gray-300 hover:border-blue-300'
        }`}
        placeholder="Escribe tu respuesta aquí..."
        rows={4}
        maxLength={question.maxLength}
      />
    );
  };

  // Renderizado de Relationship
  const renderRelationship = (question: RelationshipQuestion) => {
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Items */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 mb-3">Temas</h4>
            {question.items.map((item, index) => {
              const pairedConcept = relationshipPairs.find(pair => pair[0] === index)?.[1];
              return (
                <button
                  key={index}
                  onClick={() => setSelectedItem(selectedItem === index ? null : index)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedItem === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : pairedConcept !== undefined
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Concepts */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 mb-3">Conceptos</h4>
            {question.concepts.map((concept, index) => {
              const pairedItem = relationshipPairs.find(pair => pair[1] === index)?.[0];
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (selectedItem !== null) {
                      handleRelationshipPair(selectedItem, index);
                      setSelectedItem(null);
                    }
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                    pairedItem !== undefined
                      ? 'border-purple-500 bg-purple-50'
                      : selectedItem !== null
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {concept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pares establecidos */}
        {relationshipPairs.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-700 mb-2">Relaciones establecidas:</h4>
            <div className="space-y-2">
              {relationshipPairs.map(([itemIdx, conceptIdx], index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-600">{question.items[itemIdx]}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-600">{question.concepts[conceptIdx]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizado de Justification
  const renderJustification = (question: JustificationQuestion) => {
    return (
      <div className="space-y-6">
        {/* True/False */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleAnswer({ answer: true, justification: userAnswer?.justification || '' })}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
              userAnswer?.answer === true 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            } ${showResults ? getAnswerStatus(true === question.correctAnswer) : ''}`}
          >
            <div className="text-center font-medium text-gray-700">Verdadero</div>
          </button>
          <button
            onClick={() => handleAnswer({ answer: false, justification: userAnswer?.justification || '' })}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
              userAnswer?.answer === false 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            } ${showResults ? getAnswerStatus(false === question.correctAnswer) : ''}`}
          >
            <div className="text-center font-medium text-gray-700">Falso</div>
          </button>
        </div>

        {/* Justificación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justifica tu respuesta:
          </label>
          <textarea
            value={userAnswer?.justification || ''}
            onChange={(e) => handleAnswer({ 
              answer: userAnswer?.answer, 
              justification: e.target.value 
            })}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-blue-300"
            placeholder="Explica por qué elegiste esta respuesta..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {question.question}
          </h3>
          {question.points && (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full">
              {question.points} puntos
            </span>
          )}
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
          {question.type.replace('-', ' ')}
        </span>
      </div>

      {/* Content */}
      <div className="mt-4">
        {question.type === 'multiple-choice' && renderMultipleChoice(question)}
        {question.type === 'true-false' && renderTrueFalse(question)}
        {question.type === 'fill-blank' && renderFillBlank(question)}
        {question.type === 'short-answer' && renderShortAnswer(question)}
        {question.type === 'relationship' && renderRelationship(question)}
        {question.type === 'justification' && renderJustification(question)}
      </div>
    </div>
  );
};

export default QuestionBox;