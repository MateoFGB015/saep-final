const { Notificacion } = require('../models/asociaciones');

/**
 * Crea una notificación en la base de datos para un solo usuario.
 * @param {Object} datos
 * @param {number} datos.id_usuario - ID del usuario destinatario.
 * @param {string} datos.tipo - Tipo de notificación ('Alerta', 'Información', etc.).
 * @param {string} datos.titulo - Título corto para la notificación.
 * @param {string} datos.mensaje - Contenido del mensaje.
 * @param {string} [datos.estado='NoLeida'] - Estado inicial.
 * @returns {Promise<Object|null>} La notificación creada o null si falla.
 */
const crearNotificacion = async ({
  id_usuario,
  tipo,
  titulo,
  mensaje,
  estado = 'NoLeida'
}) => {
  try {
    if (!id_usuario || !tipo || !titulo || !mensaje) {
      console.warn('❗ Faltan campos obligatorios para crear la notificación.');
      return null;
    }

    const notificacion = await Notificacion.create({
      id_usuario,
      tipo,
      titulo,
      mensaje,
      estado,
      fecha_creacion: new Date()
    });

    return notificacion;
  } catch (error) {
    console.error('❗ Error en crearNotificacion():', error);
    return null;
  }
};

/**
 * Crea múltiples notificaciones para distintos usuarios (mismo contenido para todos).
 * @param {Array<number>} destinatarios - IDs de los usuarios destinatarios.
 * @param {Object} datos - Datos comunes de la notificación (tipo, titulo, mensaje, estado).
 * @returns {Promise<Array<Object>|null>} Array de notificaciones creadas o null si falla.
 */
const crearNotificacionesLote = async (destinatarios, datos) => {
  try {
    if (!Array.isArray(destinatarios) || destinatarios.length === 0) {
      console.warn('❗ No se proporcionaron destinatarios para la notificación.');
      return null;
    }
    if (!datos.tipo || !datos.titulo || !datos.mensaje) {
      console.warn('❗ Faltan datos obligatorios para crear notificaciones en lote.');
      return null;
    }

    const notificaciones = destinatarios.map(id_usuario => ({
      id_usuario,
      tipo: datos.tipo,
      titulo: datos.titulo,
      mensaje: datos.mensaje,
      estado: datos.estado || 'NoLeida',
      fecha_creacion: new Date()
    }));

    return await Notificacion.bulkCreate(notificaciones);
  } catch (error) {
    console.error('❗ Error en crearNotificacionesLote():', error);
    return null;
  }
};

module.exports = {
  crearNotificacion,
  crearNotificacionesLote
};
