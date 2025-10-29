'use client';

import { useParams } from 'next/navigation';
import LocalArchive from '@/services/localArchive';
import Template from '@/pages/Template';
import SummarizerPage from '../SummarizerPage';
import React from 'react';

export default function SummaryDetailPage() {
  const params = useParams();
  const idParam = params?.id as string;
  const id = Number(idParam);
  const summary = Number.isFinite(id) ? LocalArchive.getById('summary', id) as any : undefined;

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
        initialResponse={summary?.payload?.content || ''}
        title={summary?.title || 'Resumen'}
        date={summary?.dateISO}
      />
    </Template>
  );
}
