import React, { useState } from 'react';
import SummaryOptions, { SummaryOptionsData } from '../components/layout/SummaryOptions';
import PromptInput from '../components/layout/PromptInput';
import ResponseVisualizer from '../components/layout/ResponseVisualizer';

interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

const Summarizer: React.FC = () => {
  const [options, setOptions] = useState<SummaryOptionsData>({
    summaryType: null,
    languageRegister: null,
    language: null,
    detailLevel: 2,
    contentFocus: [],
    structure: []
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    console.log('Archivos subidos:', files);
  };

  const handleSendMessage = async (message: string, files: UploadedFile[]) => {
    console.log('Mensaje enviado:', message);
    console.log('Archivos:', files);
    
    setIsLoading(true);
    
    const requestData = {
      message,
      files: files.map(file => ({
        name: file.file.name,
        type: file.file.type,
        size: file.file.size
      })),
      options
    };
    
    console.log('Datos para el resumen:', requestData);
    
    // Simular llamada a la API
    setTimeout(() => {
      const mockResponse = `# Resumen Generado

## Configuración aplicada:
- **Tipo de resumen**: ${options.summaryType || 'General'}
- **Nivel de detalle**: ${options.detailLevel}/5
- **Registro lingüístico**: ${options.languageRegister || 'Neutral'}
- **Idioma**: ${options.language?.title || 'Español'}

## Contenido resumido:
${message || 'Se procesaron los archivos adjuntos para generar este resumen.'}

${files.length > 0 ? `
### Archivos procesados:
${files.map(file => `- **${file.file.name}** (${file.file.type}) - ${(file.file.size / 1024).toFixed(1)} KB`).join('\n')}
` : ''}

## Ejemplo matemático:
La fórmula cuadrática es: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

## Código de ejemplo:
\`\`\`python
def procesar_resumen(texto, opciones):
    """
    Procesa el texto según las opciones seleccionadas
    """
    detalle = opciones.get('detailLevel', 2)
    tipo = opciones.get('summaryType', 'general')
    
    if detalle > 3:
        return resumen_detallado(texto)
    else:
        return resumen_breve(texto)
\`\`\`

> Resumen generado automáticamente basado en tus preferencias.`;

      setResponse(mockResponse);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    console.log('Contenido copiado al portapapeles');
  };

  const handleRegenerate = () => {
    console.log('Regenerando respuesta...');
  };

  const handleLike = () => {
    console.log('Respuesta marcada como útil');
  };

  const handleDislike = () => {
    console.log('Respuesta marcada como no útil');
  };

  const handleExercises = () => {
    console.log('Generando ejercicios...');
  };

  const handleFlashcards = () => {
    console.log('Creando flashcards...');
  };

  const handleLearningPath = () => {
    console.log('Generando ruta de aprendizaje...');
  };

  return (
    <div className="p-6 max-w-10xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Text Summarizer</h1>



      {/* ResponseVisualizer */}
      <ResponseVisualizer
        content={response}
        onCopy={handleCopy}
        onRegenerate={handleRegenerate}
        onLike={handleLike}
        onDislike={handleDislike}
        onExercises={handleExercises}
        onFlashcards={handleFlashcards}
        onLearningPath={handleLearningPath}
        isLoading={isLoading}
      />

      {/* PromptInput component */}
            <div className="mb-6">
        <PromptInput
          placeholder="Escribe el texto que quieres resumir o sube archivos..."
          onFilesChange={handleFilesChange}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Live reflection */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
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
        
        {/* Mostrar archivos subidos en el resumen */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-2">Archivos listos para procesar:</h3>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1 text-sm border border-blue-200"
                >
                  <span className="text-blue-700 max-w-32 truncate" title={file.file.name}>
                    {file.file.name}
                  </span>
                  <span className="text-blue-500 text-xs">
                    ({(file.file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SummaryOptions component */}
      <div>
        <SummaryOptions value={options} onChange={setOptions} />
      </div>
    </div>
  );
};

export default Summarizer;