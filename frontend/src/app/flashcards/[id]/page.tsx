'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Template from '@/pages/Template';
import FlashCardContainer from '@/components/layout/FlashCardContainer';
import LocalArchive from '@/services/localArchive';

export default function FlashCardGroupPage() {
  const params = useParams<{ id: string }>();
  const idStr = params?.id;
  const id = idStr ? Number(idStr) : NaN;
  const group = Number.isFinite(id) ? (LocalArchive.getById('flashcards', id) as any) : undefined;

  if (!group) {
    return (
      <Template>
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          <p>No se encontró el grupo de flashcards con ID: {idStr}</p>
        </div>
      </Template>
    );
  }

  // Memoriza las cartas para evitar un cambio de referencia en cada render
  const cards = React.useMemo(() => group?.payload?.cards ?? [], [group?.id]);

  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{group.title}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(group.dateISO).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <FlashCardContainer initialCards={cards} />
        </div>
      </div>
    </Template>
  );
}
