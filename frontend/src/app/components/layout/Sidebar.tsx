import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      

      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
      `}>
        

        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Resúmenes</h2>
          

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Cerrar sidebar"
          >
            <i className="fas fa-times text-gray-600 text-lg"></i>
          </button>
        </div>


        <div className="p-6">

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-6">
            <i className="fas fa-plus"></i>
            Nuevo resumen
          </button>


          <nav className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
              <i className="fas fa-home text-gray-400"></i>
              <span>Inicio</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
              <i className="fas fa-file-alt text-gray-400"></i>
              <span>Mis Resúmenes</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
              <i className="fas fa-star text-gray-400"></i>
              <span>Favoritos</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
              <i className="fas fa-history text-gray-400"></i>
              <span>Recientes</span>
            </button>
          </nav>

          {/* Sección adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Configuración</h3>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
              <i className="fas fa-cog text-gray-400"></i>
              <span>Ajustes</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
              <i className="fas fa-question-circle text-gray-400"></i>
              <span>Ayuda</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;