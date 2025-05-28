import models from '../../models/Notificaciones.js';
const { Notificacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getNotificacionByUser = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  if (!idUsuario) {
    return ApiResponse.badRequest(res, 'El idNotificacion es requerido');
  }

  try {
    const notificaciones = await Notificacion.findAll({ where: { idUsuario } });
    if (notificaciones.length === 0) {
      return ApiResponse.notFound(res, 'Notificacion no encontrada');
    }
    return ApiResponse.success(res, notificaciones, 'Notificaciones obtenidas');
  } catch (error) {
    console.error('Error al buscar notificacion');
    return ApiResponse.error(res, error, 'Error al encontrar notificacion');
  }
};
