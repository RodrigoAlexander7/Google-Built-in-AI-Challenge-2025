// src/app/page.tsx
'use client';

import { useState } from 'react';
import CheckBox from "./components/ui/CheckBox/CheckBox";
import ListBox from "./components/ui/ListBox/ListBox";

const sampleCheckBoxItems = [
  {
    id: '1',
    title: 'Características Básicas',
    description: 'Funcionalidades esenciales para empezar'
  },
  {
    id: '2', 
    title: 'Análisis Avanzado',
    description: 'Herramientas de análisis y estadísticas'
  }
];

const sampleListBoxItems = [
  {
    id: 'course-1',
    title: 'Introducción a React',
    description: 'Aprende los fundamentos de React y hooks',
    icon: 'fas fa-code',
    badge: 'Nuevo'
  },
  {
    id: 'course-2',
    title: 'TypeScript Avanzado',
    description: 'Domina tipos genéricos y patrones avanzados',
    icon: 'fas fa-cogs',
    badge: 'Popular'
  },
  {
    id: 'course-3',
    title: 'Next.js 14',
    description: 'Server Components y App Router',
    icon: 'fas fa-rocket'
  },
  {
    id: 'course-4',
    title: 'Tailwind CSS',
    description: 'Diseño moderno con utilidades CSS',
    icon: 'fas fa-palette',
    disabled: true
  }
];

export default function Home() {
  const [selectedCheckBoxItems, setSelectedCheckBoxItems] = useState<string[]>([]);
  const [selectedListBoxItems, setSelectedListBoxItems] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* ListBox Examples */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Componente ListBox
          </h2>

          {/* ListBox Default */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Variante Default</h3>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <ListBox
                items={sampleListBoxItems}
                variant="default"
                selectionMode="single"
                onSelectionChange={setSelectedListBoxItems}
                emptyMessage="No hay cursos disponibles"
              />
            </div>
          </div>

          {/* ListBox Card con Búsqueda */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Variante Card + Búsqueda</h3>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <ListBox
                items={sampleListBoxItems}
                variant="card"
                selectionMode="multiple"
                searchable={true}
                onSelectionChange={setSelectedListBoxItems}
              />
            </div>
          </div>

          {/* ListBox Minimal */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Variante Minimal</h3>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <ListBox
                items={sampleListBoxItems.slice(0, 3)}
                variant="minimal"
                selectionMode="single"
                onSelectionChange={setSelectedListBoxItems}
              />
            </div>
          </div>

          {/* Estado seleccionados */}
          {selectedListBoxItems.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <i className="fas fa-list-check mr-2"></i>
                Cursos Seleccionados ({selectedListBoxItems.length})
              </h3>
              <div className="space-y-2">
                {selectedListBoxItems.map(id => {
                  const item = sampleListBoxItems.find(i => i.id === id);
                  return item ? (
                    <div key={id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-100">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <div>
                        <p className="font-medium text-green-900">{item.title}</p>
                        <p className="text-sm text-green-700">{item.description}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </section>

        {/* CheckBox Examples (existente) */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Componente CheckBox
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <CheckBox
              items={sampleCheckBoxItems}
              variant="card"
              onSelectionChange={setSelectedCheckBoxItems}
            />
          </div>
        </section>

      </main>
    </div>
  );
}