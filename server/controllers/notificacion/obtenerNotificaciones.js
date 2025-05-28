const { Notificacion } = require('../../models/Notificaciones');

const obtenerNotificacionesPorUsuario = async (req, res) => {
  try {
    const idUsuario = req.usuario.id; // Obtén el ID del usuario autenticado desde el middleware

    const notificaciones = await Notificacion.findAll({
      where: { id_usuario: idUsuario },
      order: [['fecha_creacion', 'DESC']], // O el orden que prefieras
    });

    res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error al obtener las notificaciones del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las notificaciones.' });
  }
};

module.exports = { obtenerNotificacionesPorUsuario };