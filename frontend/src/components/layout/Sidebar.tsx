'use client';
import React from 'react';
import { mockSummaries } from '@/resources/files/mockSummaries';
import { SummaryRecord } from '../../types/SummaryRecord';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  // Ordenar los resúmenes del más reciente al más antiguo
  const sortedSummaries = [...mockSummaries].sort(
    (a: SummaryRecord, b: SummaryRecord) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      {/* Botón flotante para abrir el sidebar en móvil */}
      <button
        onClick={onToggle}
        className={`
          fixed bottom-6 left-6 z-50 lg:hidden
          w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 
          text-white rounded-2xl shadow-2xl 
          flex items-center justify-center
          transform transition-all duration-500 ease-out
          hover:scale-110 hover:from-blue-600 hover:to-purple-700
          active:scale-95
          ${isOpen ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}
        `}
        aria-label="Abrir menú"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center relative">
          <span className={`absolute w-4 h-0.5 bg-white transform transition-all duration-300 ${isOpen ? 'rotate-45' : '-translate-y-1'}`}></span>
          <span className={`absolute w-4 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`absolute w-4 h-0.5 bg-white transform transition-all duration-300 ${isOpen ? '-rotate-45' : 'translate-y-1'}`}></span>
        </div>
      </button>

      {/* Fondo oscuro cuando el sidebar está abierto en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar principal */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 z-50
          transform transition-all duration-500 ease-out
          lg:relative lg:translate-x-0 lg:z-auto lg:shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-lg font-semibold text-gray-800">Resúmenes</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group"
            aria-label="Cerrar sidebar"
          >
            <i className="fas fa-times text-gray-600 text-lg group-hover:text-red-500 group-hover:rotate-90 transition-all duration-300"></i>
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="p-6">
            {/* Botón Nuevo Resumen */}
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mb-8 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 group">
              <i className="fas fa-plus group-hover:rotate-90 transition-transform duration-300"></i>
              <span>Nuevo Resumen</span>
            </button>

            {/* Lista de resúmenes */}
            <div className="space-y-1 mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Mis Resúmenes
              </h3>

              {sortedSummaries.length > 0 ? (
                sortedSummaries.map((summary) => (
                  <a
                    key={summary.id}
                    href={`/summaries/${summary.id}`}
                    onClick={onClose}
                    className="block px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 group relative"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium truncate">{summary.title}</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(summary.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Línea de acento al pasar el mouse */}
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </a>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-4 py-2">
                  No hay resúmenes guardados.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
