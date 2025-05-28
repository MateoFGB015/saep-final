const { Notificacion } = require('../../models/Notificaciones'); // Asegúrate de la 'I' mayúscula

const createNotificacion = async (req, res) => {
  try {
    const { id_usuario, mensaje, tipo } = req.body;
    console.log('Contenido completo de req.body:', req.body);
    //console.log('Valor de fecha_creacion:', fecha_creacion);

    console.log('Datos para crear notificación:', { id_usuario, mensaje, tipo }); // <---- LOG ANTES DE CREAR

    const nuevaNotificacion = await Notificacion.create({
      id_usuario,
      mensaje,
      tipo,
    });

    res.status(201).json({
      success: true,
      data: nuevaNotificacion,
    });
  } catch (error) {
    console.error("Error al crear notificación:", error); // <---- LOG DEL ERROR
    res.status(500).json({
      success: false,
      message: "No se pudo crear la notificación",
      error: error.message, // <---- INCLUYE EL MENSAJE DEL ERROR
    });
  }
};

module.exports = { createNotificacion };