const { Notificacion} = require('../../models/Notificaciones');
const { FichaAprendiz} = require('../../models/FichaAprendiz');
const { Ficha } = require('../../models/fichas'); 
const {Usuario} = require('../../models/Usuario'); 

const solicitarVisita = async (req, res) => {
  try {
    const idAprendiz = req.user.id_usuario; // 👈 Asegúrate que `authMiddleware` setea esto correctamente
    const rol = req.user.rol;

    // Verificación de seguridad
    if (rol !== 'Aprendiz') {
      return res.status(403).json({ error: 'Solo los aprendices pueden solicitar visitas.' });
    }

    // Paso 1: Buscar la FichaAprendiz del aprendiz
    const fichaAprendiz = await FichaAprendiz.findOne({
      where: { id_usuario: idAprendiz },
      include: {
        model: Ficha,
        as: 'ficha',
      }
    });

    if (!fichaAprendiz || !fichaAprendiz.ficha) {
      return res.status(404).json({ error: 'No se encontró una ficha asignada al aprendiz.' });
    }

    const idInstructor = fichaAprendiz.ficha.id_instructor;

    if (!idInstructor) {
      return res.status(404).json({ error: 'La ficha no tiene un instructor asignado.' });
    }

    // Paso 2: Crear la notificación para el instructor
    const notificacion = await Notificacion.create({
      tipo: 'Solicitud',
      titulo: 'Solicitud de Visita',
      mensaje: 'El aprendiz ha solicitado una visita de seguimiento.',
      fecha_creacion: new Date(),
      estado: 'NoLeida',
      id_usuario: idInstructor
    });

    return res.status(201).json({
      mensaje: 'Notificación enviada correctamente al instructor.',
      notificacion
    });

  } catch (error) {
    console.error('Error al crear la notificación:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { solicitarVisita };
