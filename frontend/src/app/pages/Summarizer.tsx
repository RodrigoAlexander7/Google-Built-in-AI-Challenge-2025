import React, { useState } from 'react';
import Slider from '../components/ui/Slider/Slider';

const Summarizer: React.FC = () => {
  const [length, setLength] = useState(50);
  const [quality, setQuality] = useState(75);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Configuración del Resumen
      </h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Slider
          label="Longitud del resumen"
          min={10}
          max={100}
          value={length}
          onChange={setLength}
          showValue={true}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Slider
          label="Calidad del resumen"
          min={1}
          max={100}
          value={quality}
          onChange={setQuality}
          showValue={true}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Slider
          label="Nivel de detalle"
          min={0}
          max={5}
          step={1}
          value={3}
          onChange={(val) => console.log('Detalle:', val)}
          showValue={true}
        />
      </div>
    </div>
  );
};

export default Summarizer;