'use client';

import { useParams } from 'next/navigation';
import { mockSummaries } from '@/resources/files/mockSummaries';
import { SummaryRecord } from '../../../types/SummaryRecord';
import Template from '@/pages/Template';
import SummarizerPage from '../SummarizerPage';
import React from 'react';

export default function SummaryDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // Buscar el resumen correspondiente
  const summary: SummaryRecord | undefined = mockSummaries.find((s) => s.id === id);

  if (!summary) {
    return (
      <Template>
        <div className="p-8 text-center text-gray-600">
          <h2 className="text-2xl font-semibold mb-4">Resumen no encontrado</h2>
          <p>El resumen que intentas ver no existe o fue eliminado.</p>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <SummarizerPage
        initialResponse={summary.response}
        title={summary.title}
        date={summary.date}
        files={summary.files}
      />
    </Template>
  );
}
