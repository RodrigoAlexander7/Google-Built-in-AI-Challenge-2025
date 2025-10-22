'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface LearningPathData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  // Agregar más campos según sea necesario
}

export default function LearningPathViewPage() {
  const params = useParams();
  const [pathData, setPathData] = useState<LearningPathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del learning path
    // En el futuro, aquí se haría la llamada real a la API
    const loadLearningPath = async () => {
      setIsLoading(true);
      
      // Simular delay de carga
      setTimeout(() => {
        const mockData: LearningPathData = {
          id: (params?.id as string) || 'unknown',
          title: 'Mi Learning Path',
          description: 'Esta es la página donde se mostrará el contenido completo del Learning Path.',
          createdAt: new Date().toISOString()
        };
        
        setPathData(mockData);
        setIsLoading(false);
      }, 1000);
    };

    if (params?.id) {
      loadLearningPath();
    }
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando Learning Path...</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Learning Path no encontrado</h2>
          <p className="text-gray-600">El Learning Path que buscas no existe o fue eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{pathData.title}</h1>
              <p className="text-gray-600">{pathData.description}</p>
              <p className="text-sm text-gray-400 mt-2">
                ID: {pathData.id} | Creado: {new Date(pathData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder para contenido futuro */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Contenido en Desarrollo
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Esta es la página donde se mostrará el contenido completo del Learning Path, 
              incluyendo módulos, lecciones, ejercicios y más.
            </p>
          </div>
        </div>

        {/* Sección de ejemplo de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((module) => (
            <div
              key={module}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {module}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Módulo {module}</h3>
                  <p className="text-xs text-gray-500">Próximamente</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Contenido del módulo {module} se agregará próximamente.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
