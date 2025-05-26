import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ data = arreglo de agendamientos
// ✅ fechas = { fechaInicio, fechaFin }
export const generarPDF_Agendamientos = (data, fechas) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text("Reporte de agendamientos por rango de fechas", 105, 15, { align: "center" });

  // Fechas seleccionadas
  doc.setFontSize(12);
  doc.text(`Desde: ${fechas.fechaInicio}`, 20, 30);
  doc.text(`Hasta: ${fechas.fechaFin}`, 140, 30);

  // Tabla
  autoTable(doc, {
    startY: 40,
    head: [["Nombre", "Apellido", "Documento", "Fecha", "Estado"]],
    body: data.map(item => [
      item.nombre,
      item.apellido,
      item.documento,
      new Date(item.fecha_inicio).toLocaleDateString(),
      item.estado_visita
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [113, 39, 122] },
  });

  // Pie de página
  doc.setFontSize(10);
  doc.text(
    `Fecha de creación del reporte: ${new Date().toLocaleDateString()}`,
    105,
    doc.internal.pageSize.height - 10,
    { align: "center" }
  );

  doc.save("reporte_agendamientos.pdf");
};
