'use client';

import { useParams } from 'next/navigation';
import { mockPracticePages } from '../../../resources/files/mockPractice';
import PracticeQuestionBox from '@/components/layout/PracticeQuestionBox';
import Template from '@/pages/Template';

export default function PracticeDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : undefined;
  const practice = mockPracticePages.find((p) => p.id === id);

  if (!practice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">404 - Práctica no encontrada</h1>
        <p className="text-gray-500">La práctica con ID "{id}" no existe.</p>
      </div>
    );
  }

  return (
    <Template>
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{practice.title}</h1>
        <p className="text-gray-500">
          {new Date(practice.date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="space-y-6">
        {practice.questions.map((question) => (
          <PracticeQuestionBox key={question.id} question={question} />
        ))}
      </div>
    </div>
    </Template>
  );
}
