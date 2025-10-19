'use client';

import { useState } from 'react';
import Sidebar from "./components/layout/Sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        

        <div className="flex-1 lg:ml-0">

          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-2xl font-bold text-gray-800">Mi Aplicación</h1>
              

              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 lg:hidden"
                aria-label="Abrir/cerrar sidebar"
              >
                <i className="fas fa-bars text-gray-600"></i>
              </button>
            </div>
          </header>

        </div>
      </div>
    </div>
  );
}