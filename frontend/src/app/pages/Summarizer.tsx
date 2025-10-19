import React, { useState } from 'react';
import SummaryOptions, { SummaryOptionsData } from '../components/layout/SummaryOptions';

const Summarizer: React.FC = () => {
  // Keep current selections in parent
  const [options, setOptions] = useState<SummaryOptionsData>({
    summaryType: null,
    languageRegister: null,
    language: null,
    detailLevel: 2,
    contentFocus: [],
    structure: []
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Text Summarizer</h1>

      <SummaryOptions value={options} onChange={setOptions} />

      {/* Live reflection */}
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Opciones seleccionadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p><span className="text-gray-500">Tipo:</span> {options.summaryType ?? '—'}</p>
            <p><span className="text-gray-500">Registro:</span> {options.languageRegister ?? '—'}</p>
            <p><span className="text-gray-500">Idioma:</span> {options.language?.title ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <p><span className="text-gray-500">Nivel de detalle:</span> {options.detailLevel}</p>
            <p><span className="text-gray-500">Enfocar en:</span> {options.contentFocus.length ? options.contentFocus.join(', ') : '—'}</p>
            <p><span className="text-gray-500">Atributos (Sí):</span> {options.structure.length ? options.structure.join(', ') : '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;