import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generarReporteAprendizPDF = (data) => {
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE COMPLETO DEL APRENDIZ', 105, y, { align: 'center' });

  y += 10;

  // Ficha
  autoTable(doc, {
    startY: y,
    head: [['Información de ficha']],
    body: data.fichasAprendiz.map(f => [
      `Programa: ${f.ficha?.nombre_programa}\nNivel: Tecnólogo\nFicha: ${f.ficha?.numero_ficha}\nInicio: ${f.ficha?.inicio_etapa_productiva}\nFin: ${f.ficha?.fin_etapa_productiva}`
    ]),
    theme: 'grid',
    styles: { cellPadding: 3, fontSize: 10 },
  });

  y = doc.lastAutoTable.finalY + 5;

  // Aprendiz
  autoTable(doc, {
    startY: y,
    head: [['Información del aprendiz']],
    body: [[
      `Nombre: ${data.nombre} ${data.apellido}\nDocumento: ${data.numero_documento}\nTipo: ${data.tipo_documento}\nTeléfono: ${data.telefono}\nCorreo: ${data.correo_electronico}`
    ]],
    theme: 'grid',
    styles: { cellPadding: 3, fontSize: 10 },
  });

  y = doc.lastAutoTable.finalY + 5;

  // Empresa
  autoTable(doc, {
    startY: y,
    head: [['Información de la empresa']],
    body: [[
      `Empresa: ${data.detalle_aprendiz?.empresa?.razon_social}\nDirección: ${data.detalle_aprendiz?.empresa?.direccion}\nCorreo: ${data.detalle_aprendiz?.empresa?.correo_electronico}\nTeléfono: ${data.detalle_aprendiz?.empresa?.telefono}\nJefe: ${data.detalle_aprendiz?.jefe_inmediato}`
    ]],
    theme: 'grid',
    styles: { cellPadding: 3, fontSize: 10 },
  });

  // Documentos
  const documentos = data.fichasAprendiz.flatMap(f => f.documentos || []);
  if (documentos.length > 0) {
    y = doc.lastAutoTable.finalY + 5;
    autoTable(doc, {
      startY: y,
      head: [['Documentos', 'Descripción']],
      body: documentos.map(d => [` ${d.nombre_documento}`, d.descripcion]),
      styles: { fontSize: 10 },
    });
  }

  // Bitácoras
  const bitacoras = data.fichasAprendiz.flatMap(f => f.bitacoras || []);
  if (bitacoras.length > 0) {
    y = doc.lastAutoTable.finalY + 5;
    autoTable(doc, {
      startY: y,
      head: [['Bitácoras', 'Estado']],
      body: bitacoras.map(b => [` Bitácora #${b.numero_bitacora}`, b.estado_bitacora]),
      styles: { fontSize: 10 },
    });
  }

  // Agendamientos
  const agendamientos = data.fichasAprendiz.flatMap(f => f.agendamientos || []);
  if (agendamientos.length > 0) {
    y = doc.lastAutoTable.finalY + 5;
    autoTable(doc, {
      startY: y,
      head: [['Visita', 'Fecha', 'Estado']],
      body: agendamientos.map(a => [
        ` Visita #${a.numero_visita}`,
        new Date(a.fecha_inicio).toLocaleDateString(),
        a.estado_visita
      ]),
      styles: { fontSize: 10 },
    });
  }

  doc.save(`ReporteAprendiz_${data.nombre}_${data.apellido}.pdf`);
};

export default generarReporteAprendizPDF;
