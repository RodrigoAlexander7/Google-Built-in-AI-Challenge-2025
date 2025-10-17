// src/app/page.tsx
'use client';

import { useState } from 'react';
import CheckBox from "./components/ui/CheckBox/CheckBox";
import ListBox from "./components/ui/ListBox/ListBox";
import ComboBox from "./components/ui/ComboBox/ComboBox";

// Datos de ejemplo
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
  }
];

const sampleComboBoxItems = [
  {
    id: 'lang-1',
    title: 'JavaScript',
    description: 'Lenguaje de programación web',
    icon: 'fab fa-js',
    category: 'Frontend'
  },
  {
    id: 'lang-2',
    title: 'Python',
    description: 'Lenguaje versátil para data science y web',
    icon: 'fab fa-python',
    category: 'Backend'
  },
  {
    id: 'lang-3',
    title: 'TypeScript',
    description: 'JavaScript con tipos estáticos',
    icon: 'fas fa-code',
    category: 'Frontend'
  },
  {
    id: 'lang-4',
    title: 'Java',
    description: 'Lenguaje empresarial robusto',
    icon: 'fab fa-java',
    category: 'Backend'
  },
  {
    id: 'lang-5',
    title: 'Go',
    description: 'Lenguaje eficiente para sistemas',
    icon: 'fas fa-code',
    category: 'Backend'
  }
];

export default function Home() {
  const [selectedCheckBoxItems, setSelectedCheckBoxItems] = useState<string[]>([]);
  const [selectedListBoxItems, setSelectedListBoxItems] = useState<string[]>([]);
  const [selectedComboBoxItem, setSelectedComboBoxItem] = useState<any>(null);
  const [createdItems, setCreatedItems] = useState<any[]>([]);

  const handleCreateNew = (searchTerm: string) => {
    const newItem = {
      id: `custom-${Date.now()}`,
      title: searchTerm,
      description: 'Elemento personalizado creado por el usuario',
      icon: 'fas fa-plus',
      category: 'Personalizado'
    };
    
    setCreatedItems(prev => [...prev, newItem]);
    setSelectedComboBoxItem(newItem);
  };

  const allComboBoxItems = [...sampleComboBoxItems, ...createdItems];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* ComboBox Examples */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Componente ComboBox
          </h2>

          {/* ComboBox Básico */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">ComboBox Básico</h3>
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
              <ComboBox
                items={allComboBoxItems}
                value={selectedComboBoxItem}
                placeholder="Selecciona un lenguaje de programación..."
                onSelect={setSelectedComboBoxItem}
                searchable={true}
                showCategory={true}
              />
            </div>
          </div>

          {/* ComboBox Creatable */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">ComboBox con Creación</h3>
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
              <ComboBox
                items={allComboBoxItems}
                value={selectedComboBoxItem}
                placeholder="Selecciona o crea un nuevo lenguaje..."
                onSelect={setSelectedComboBoxItem}
                onCreateNew={handleCreateNew}
                creatable={true}
                searchable={true}
                showCategory={true}
              />
              <p className="text-sm text-gray-500 mt-3">
                💡 Escribe el nombre de un lenguaje que no esté en la lista y presiona Enter para crearlo
              </p>
            </div>
          </div>

          {/* ComboBox Deshabilitado */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">ComboBox Deshabilitado</h3>
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
              <ComboBox
                items={sampleComboBoxItems}
                placeholder="ComboBox deshabilitado..."
                disabled={true}
              />
            </div>
          </div>

          {/* Estado seleccionado */}
          {selectedComboBoxItem && (
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                Elemento Seleccionado
              </h3>
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                {selectedComboBoxItem.icon && (
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className={`${selectedComboBoxItem.icon} text-blue-600 text-lg`}></i>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{selectedComboBoxItem.title}</h4>
                  <p className="text-gray-600 text-sm">{selectedComboBoxItem.description}</p>
                  {selectedComboBoxItem.category && (
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {selectedComboBoxItem.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedComboBoxItem(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ListBox Examples */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Componente ListBox
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ListBox
              items={sampleListBoxItems}
              variant="card"
              selectionMode="multiple"
              searchable={true}
              onSelectionChange={setSelectedListBoxItems}
            />
          </div>
        </section>

        {/* CheckBox Examples */}
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