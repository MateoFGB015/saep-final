import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generarPDF = (data, formulario) => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMATO PLANEACIÓN, SEGUIMIENTO Y EVALUACIÓN ETAPA PRODUCTIVA', 10, 15);

  // Información General
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Regional: ${formulario.regional || ''}`, 10, 30);
  doc.text(`Centro de Formación: ${formulario.centroFormacion || ''}`, 10, 35);
  doc.text(`Programa de Formación: ${data?.fichasAprendiz[0]?.ficha?.nombre_programa || ''}`, 10, 40);
  doc.text(`Ficha No: ${data?.fichasAprendiz[0]?.ficha?.numero_ficha || ''}`, 10, 45);

  // Datos del aprendiz
  doc.text(`Nombre del Aprendiz: ${data?.nombre || ''} ${data?.apellido || ''}`, 10, 55);
  doc.text(`Identificación: ${data?.numero_documento || ''}`, 10, 60);
  doc.text(`Teléfono: ${data?.telefono || ''}`, 10, 65);
  doc.text(`E-mail: ${data?.correo_electronico || ''}`, 10, 70);

  // Datos empresa
  doc.text(`Razón Social Empresa: ${data?.detalle_aprendiz?.empresa?.razon_social || ''}`, 10, 80);
  doc.text(`Dirección: ${data?.detalle_aprendiz?.empresa?.direccion || ''}`, 10, 85);
  doc.text(`Jefe Inmediato: ${data?.detalle_aprendiz?.jefe_inmediato || ''}`, 10, 90);

  // Planeación
  autoTable(doc, {
    startY: 100,
    head: [[
      'ACTIVIDADES A DESARROLLAR',
      'EVIDENCIAS DE APRENDIZAJE',
      'RECOLECCIÓN DE EVIDENCIAS'
    ]],
    body: [[
      formulario.actividades || '',
      formulario.evidencias || '',
      formulario.recoleccion || ''
    ]]
  });

  // Firma
  const y = doc.lastAutoTable.finalY + 20;
  doc.text(`____________________`, 10, y);
  doc.text(`Firma del Aprendiz`, 10, y + 5);

  // Guardar PDF
  const nombreArchivo = `Reporte_GFPI_${data?.nombre || 'Aprendiz'}_${data?.apellido || ''}.pdf`;
  doc.save(nombreArchivo);
};

export default generarPDF;
