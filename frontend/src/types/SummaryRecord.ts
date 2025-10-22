export interface SummaryRecord {
    id: string;           // ID único
    date: string;         // Fecha ISO
    files: {
      name: string;
      type: string;
      size: number;
    }[];                  // Archivos adjuntos
    response: string;     // Resumen final editable
}
  