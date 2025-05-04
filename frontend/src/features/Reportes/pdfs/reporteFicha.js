// src/features/reportes/components/pdfs/reporteFicha.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarReporteFicha = (ficha, aprendices) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Reporte de Ficha: ${ficha.numero_ficha}`, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['Nombre del Programa', 'Nivel', 'Inicio', 'Fin']],
    body: [[
      ficha.nombre_programa,
      ficha.nivel || 'Tecnólogo',
      ficha.fecha_inicio,
      ficha.fecha_fin
    ]],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Nombre', 'Apellido', 'Documento']],
    body: aprendices.map(a => [a.nombre, a.apellido, a.numero_documento]),
  });

  doc.save(`reporte_ficha_${ficha.numero_ficha}.pdf`);
};
