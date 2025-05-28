const { Notificacion } = require('../../models/Notificaciones');

const updateNotificacionState = async (req, res) => {
  const { idNotificacion } = req.params;
  const { estado } = req.body;

  console.log(
    '🔔 [controller] updateNotificacionState →',
    'idNotificacion=', idNotificacion,
    'estado=', estado
  );

  if (estado === undefined) {
    return res.status(400).json({ message: 'Estado requerido' });
  }
  try {
    const [updated] = await Notificacion.update(
      { estado },
      { where: { id_notificacion: idNotificacion } }
    );
    console.log('🔔 [controller] filas actualizadas:', updated);
    if (!updated) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }
    return res.status(200).json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error actualizando estado' });
  }
};

module.exports = { updateNotificacionState };
