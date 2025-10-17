// src/components/ui/CheckBox/CheckBox.tsx


'use client';

import React, { useState } from 'react';
import CheckBoxItem, { CheckBoxItemProps } from './CheckBoxItem';

export interface CheckBoxItemData {
  id: string;
  title: string;
  description: string;
}

export interface CheckBoxProps {
  items: CheckBoxItemData[];
  variant?: CheckBoxItemProps['variant'];
  selectionMode?: 'single' | 'multiple';
  disabled?: boolean;
  className?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  items,
  variant = 'default',
  selectionMode = 'multiple',
  disabled = false,
  className = '',
  onSelectionChange
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    let newSelectedIds: string[];
    
    if (selectionMode === 'single') {
      newSelectedIds = selectedIds.includes(id) ? [] : [id];
    } else {
      newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter(selectedId => selectedId !== id)
        : [...selectedIds, id];
    }

    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const selectAll = () => {
    const allIds = items.map(item => item.id);
    setSelectedIds(allIds);
    onSelectionChange?.(allIds);
  };

  const clearAll = () => {
    setSelectedIds([]);
    onSelectionChange?.([]);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header with Select All/Clear All - Only for multiple selection */}
      {selectionMode === 'multiple' && items.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            {selectedIds.length} de {items.length} seleccionados
          </span>
          <div className="flex space-x-2">
            <button
              onClick={selectAll}
              disabled={disabled}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Seleccionar todos
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={clearAll}
              disabled={disabled}
              className="text-xs text-gray-600 hover:text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <CheckBoxItem
            key={item.id}
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onToggle={handleToggle}
            variant={variant}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-inbox text-3xl mb-2 opacity-50"></i>
          <p>No hay elementos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default CheckBox;