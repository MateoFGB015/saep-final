const Notificacion = require('../../models/Notificaciones');
const Usuario = require('../../models/usuario');

const getNotificaciones = async (req, res) => {
  try {
    const { id, rol } = req.usuario;

    if (!id || !rol) {
      return res.status(401).json({ message: 'Token inválido: falta el id o rol del usuario' });
    }

    // Buscar notificaciones propias
    const notificaciones = await Notificacion.findAll({
      where: { id_usuario: id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'correo_electronico', 'rol']
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });

    res.status(200).json({ notificaciones });
  } catch (error) {
    console.error('🔴 Error al obtener notificaciones:', error);
    res.status(500).json({ message: 'Error al obtener las notificaciones' });
  }
};

module.exports = getNotificaciones;
