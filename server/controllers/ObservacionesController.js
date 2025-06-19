const Observacion = require('../models/observacion');
const Bitacora = require('../models/Bitacora');
const FichaAprendiz = require('../models/FichaAprendiz');
const Usuario = require('../models/usuario');
const { crearNotificacion } = require('../service/notificacionservice');


exports.crearOActualizarObservacion = async (req, res) => {
  try {
    const { id: id_usuario, rol: rol_usuario } = req.usuario;
    const { id_bitacora } = req.params;
    const { observacion, mostrar_observacion } = req.body;

    const rolesPermitidos = ['Administrador', 'Instructor', 'aprendiz'];
    if (!rolesPermitidos.includes(rol_usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para dejar observaciones.' });
    }

    if (!observacion || observacion.trim() === '') {
      return res.status(400).json({ mensaje: 'La observación no puede estar vacía.' });
    }

    const yaExiste = await Observacion.findOne({
      where: {
        id_usuario,
        rol_usuario,
        tipo_objetivo: 'bitacora',
        id_objetivo: id_bitacora
      }
    });

    let observacionFinal;
    if (yaExiste) {
      yaExiste.observacion = observacion;
      yaExiste.mostrar_observacion = mostrar_observacion ?? true;
      yaExiste.fecha_ultima_actualizacion = new Date();
      await yaExiste.save({ silent: false });
      await yaExiste.reload();
      observacionFinal = yaExiste;
    } else {
      observacionFinal = await Observacion.create({
        id_usuario,
        rol_usuario,
        tipo_objetivo: 'bitacora',
        id_objetivo: id_bitacora,
        observacion,
        mostrar_observacion: mostrar_observacion ?? true,
        fecha_ultima_actualizacion: new Date()
      });
    }

    // ✅ Crear notificación (con manejo individual del error)
    if (rol_usuario !== 'aprendiz') {
      try {
        const bitacora = await Bitacora.findByPk(id_bitacora, {
          include: { model: FichaAprendiz, as: 'fichaAprendiz' }
        });

        if (bitacora?.fichaAprendiz?.id_usuario) {
          await crearNotificacion({
            id_usuario: bitacora.fichaAprendiz.id_usuario,
            tipo: 'Información',
            titulo: 'Nueva observación en tu bitácora',
            mensaje: 'Un instructor o administrador ha realizado una observación sobre una de tus bitácoras.',
            estado: 'NoLeida'
          });
        } else {
          console.warn('❗ No se pudo determinar el aprendiz destinatario de la notificación.');
        }
      } catch (errorNotificacion) {
        console.error('❗ Error al crear la notificación:', errorNotificacion);
        // 👈 Aquí ya NO interrumpe el flujo del controlador si falla la notificación
      }
    }

    return res.status(201).json({ mensaje: 'Observación guardada correctamente.', data: observacionFinal });

  } catch (error) {
    console.error('❌ Error general al crear/actualizar observación:', error);
    return res.status(500).json({ mensaje: 'Error del servidor.', error });
  }
};

exports.verObservacionesDeBitacora = async (req, res) => {
  try {
    const { id_bitacora } = req.params;
    const { rol } = req.usuario;

    const rolesPermitidos = ['Administrador', 'Instructor', 'aprendiz'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para ver observaciones.' });
    }

    const observaciones = await Observacion.findAll({
      where: {
        tipo_objetivo: 'bitacora',
        id_objetivo: id_bitacora
      },
      include: [{
        model: Usuario,
        as: 'usuarioCreador',
        attributes: ['id_usuario', 'nombre', 'apellido', 'rol']
      }],
      order: [['fecha_ultima_actualizacion', 'DESC']]
    });

    return res.status(200).json({ observaciones });

  } catch (error) {
    console.error('❌ Error al obtener observaciones:', error);
    res.status(500).json({ mensaje: 'Error del servidor al obtener las observaciones', error });
  }
};

//eliminar observacion solo para administrador
exports.eliminarObservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.usuario;

    // ✅ Solo el administrador puede eliminar observaciones
    if (rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Solo el administrador puede eliminar observaciones.' });
    }

    // Buscar la observación
    const observacion = await Observacion.findByPk(id);

    if (!observacion) {
      return res.status(404).json({ mensaje: 'Observación no encontrada.' });
    }

    // Eliminarla
    await observacion.destroy();

    res.status(200).json({ mensaje: '✅ Observación eliminada correctamente.' });

  } catch (error) {
    console.error('❌ Error al eliminar observación:', error);
    res.status(500).json({ mensaje: 'Error del servidor al eliminar la observación.', error });
  }
};