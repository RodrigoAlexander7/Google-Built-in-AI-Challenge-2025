import React from 'react';

import { mockSummaries } from '@/resources/files/mockSummaries';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  // Menú principal del sidebar
  const mainMenuItems = [
    { name: 'Inicio', href: '/', icon: 'fas fa-home', badge: null },
    { name: 'Mis Resúmenes', href: '/summaries', icon: 'fas fa-file-alt', badge: '12' },
    { name: 'Favoritos', href: '/favorites', icon: 'fas fa-star', badge: null },
    { name: 'Recientes', href: '/recent', icon: 'fas fa-history', badge: '3' },
    { name: 'Plantillas', href: '/templates', icon: 'fas fa-layer-group', badge: 'New' },
  ];

  // Herramientas adicionales
  const toolsItems = [
    { name: 'Analizador IA', href: '/analyzer', icon: 'fas fa-brain', badge: 'Pro' },
    { name: 'Exportar', href: '/export', icon: 'fas fa-download', badge: null },
    { name: 'Colaborar', href: '/collaborate', icon: 'fas fa-users', badge: null },
  ];

  // Configuración
  const settingsItems = [
    { name: 'Ajustes', href: '/settings', icon: 'fas fa-cog', badge: null },
    { name: 'Ayuda', href: '/help', icon: 'fas fa-question-circle', badge: null },
    { name: 'Feedback', href: '/feedback', icon: 'fas fa-comment-dots', badge: null },
  ];

  return (
    <>
      {/* Botón flotante para móvil - Similar a DeepSeek */}
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

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Principal */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 z-50
        transform transition-all duration-500 ease-out
        lg:relative lg:translate-x-0 lg:z-auto lg:shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          

          {/* Botón cerrar - Solo móvil */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group"
            aria-label="Cerrar sidebar"
          >
            <i className="fas fa-times text-gray-600 text-lg group-hover:text-red-500 group-hover:rotate-90 transition-all duration-300"></i>
          </button>
        </div>

        {/* Contenido del Sidebar */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="p-6">
            {/* Botón Nuevo Resumen */}
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mb-8 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 group">
              <i className="fas fa-plus group-hover:rotate-90 transition-transform duration-300"></i>
              <span>Nuevo Resumen</span>
            </button>

            {/* Navegación Principal */}
            <div className="space-y-1 mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Navegación
              </h3>
              {mainMenuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 group group relative"
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${item.icon} text-blue-500 w-5 text-center group-hover:scale-110 transition-transform duration-300`}></i>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.badge === 'New' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {/* Efecto de subrayado animado */}
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </a>
              ))}
            </div>

            {/* Herramientas */}
            <div className="space-y-1 mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Herramientas
              </h3>
              {toolsItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 transition-all duration-300 group relative"
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${item.icon} text-purple-500 w-5 text-center group-hover:scale-110 transition-transform duration-300`}></i>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Configuración */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Configuración
              </h3>
              {settingsItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-300 group"
                >
                  <i className={`${item.icon} text-gray-500 w-5 text-center group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="font-medium">{item.name}</span>
                  <i className="fas fa-chevron-right text-xs text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 ml-auto"></i>
                </a>
              ))}
            </div>

            {/* Footer del Sidebar */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <i className="fas fa-crown text-yellow-500 text-xl"></i>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Upgrade to Pro</h4>
                <p className="text-xs text-gray-600 mb-3">Más funciones y sin límites</p>
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-xl text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;