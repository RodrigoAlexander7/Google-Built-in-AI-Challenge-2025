'use client';

import { useParams } from 'next/navigation';
import LocalArchive from '@/services/localArchive';
import PracticeQuestionBox from '@/components/layout/PracticeQuestionBox';
import Template from '@/pages/Template';

export default function PracticeDetailPage() {
  const params = useParams();
  const idStr = typeof params?.id === 'string' ? params.id : undefined;
  const id = idStr ? Number(idStr) : NaN;
  const practice = Number.isFinite(id) ? (LocalArchive.getById('practice', id) as any) : undefined;

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
          {new Date(practice.dateISO).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="space-y-6">
        {(practice?.payload?.questions ?? []).map((question: any, idx: number) => (
          <PracticeQuestionBox key={question.id ?? idx} question={question} />
        ))}
      </div>
    </div>
    </Template>
  );
}
