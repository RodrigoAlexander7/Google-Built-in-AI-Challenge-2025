// src/app/page.tsx
'use client';

import { useState } from 'react';
import CheckBox from "./components/ui/CheckBox/CheckBox";

// Define el tipo para los items
interface CheckBoxItem {
  id: string;
  title: string;
  description: string;
}

const sampleItems: CheckBoxItem[] = [
  {
    id: '1',
    title: 'Características Básicas',
    description: 'Funcionalidades esenciales para empezar'
  },
  {
    id: '2', 
    title: 'Análisis Avanzado',
    description: 'Herramientas de análisis y estadísticas'
  },
  {
    id: '3',
    title: 'Exportación de Datos',
    description: 'Exporta tus resultados en múltiples formatos'
  },
  {
    id: '4',
    title: 'Soporte Prioritario',
    description: 'Atención personalizada 24/7'
  }
];

export default function Home() {
  // Estado para los items seleccionados
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Manejador de cambios en la selección
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(selectedIds);
    console.log('Elementos seleccionados:', selectedIds);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16"> {/* pt-16 para compensar el navbar fixed */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        

          
          <CheckBox
            items={sampleItems}
            variant="default"
            selectionMode="single"
            onSelectionChange={handleSelectionChange}
            className="max-w-2xl mx-auto"
          />
        


      </main>
    </div>
  );
}