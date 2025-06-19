const Notificacion = require('../../models/Notificaciones');
const FichaAprendiz = require('../../models/FichaAprendiz');
const Ficha = require('../../models/fichas');
const Usuario = require('../../models/usuario');

const solicitarVisita = async (req, res) => {
  try {
    const idAprendiz = req.usuario?.id;
    const rol = req.usuario?.rol;

    if (!idAprendiz) {
      return res.status(401).json({ error: 'No se pudo obtener el ID del usuario desde el token.' });
    }

    if (rol !== 'aprendiz') {
      return res.status(403).json({ error: 'Solo los aprendices pueden solicitar visitas.' });
    }

    const { mensajePersonalizado } = req.body;

    // 🧩 Buscar la ficha del aprendiz con su instructor
    const fichaAprendiz = await FichaAprendiz.findOne({
      where: { id_usuario: idAprendiz },
      include: {
        model: Ficha,
        as: 'ficha',
        include: {
          model: Usuario,
          as: 'instructor'
        }
      }
    });

    if (!fichaAprendiz || !fichaAprendiz.ficha) {
      return res.status(404).json({ error: 'No se encontró una ficha asignada al aprendiz.' });
    }

const instructorId = fichaAprendiz.ficha.id_instructor;
if (!instructorId) {
  return res.status(404).json({ error: 'La ficha no tiene un instructor asignado.' });
}

    // 🔍 Verificar si ya existe una solicitud pendiente del mismo aprendiz a ese instructor
    const solicitudExistente = await Notificacion.findOne({
      where: {
        tipo: 'Solicitud',
        titulo: 'Solicitud de Visita',
        estado: 'NoLeida',
        id_usuario: instructorId
      }
    });

    if (solicitudExistente) {
      return res.status(409).json({ error: 'Ya existe una solicitud pendiente para este instructor.' });
    }

    // 📥 Obtener los datos del aprendiz para incluirlos en el mensaje
    const aprendiz = await Usuario.findByPk(idAprendiz);

    const mensaje = `El aprendiz ${aprendiz.nombres} ha solicitado una visita de seguimiento.` +
      (mensajePersonalizado ? `\n\nMensaje adicional:\n${mensajePersonalizado}` : '');

    // 📨 Crear notificación
    const notificacion = await Notificacion.create({
      tipo: 'Solicitud',
      titulo: 'Solicitud de Visita',
      mensaje,
      fecha_creacion: new Date(),
      estado: 'NoLeida',
      id_usuario: instructorId
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
