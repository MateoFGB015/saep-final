const Observacion = require('../models/observacion');
const Usuario = require('../models/usuario');


exports.crearOActualizarObservacion = async (req, res) => {
  try {
    const { id: id_usuario, rol: rol_usuario } = req.usuario;
    const { id_bitacora } = req.params;
    const { observacion, mostrar_observacion } = req.body;

    // Validar roles válidos
    const rolesPermitidos = ['Administrador', 'Instructor', 'Aprendiz'];
    if (!rolesPermitidos.includes(rol_usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para dejar observaciones.' });
    }

    // Validar campos requeridos
    if (!observacion || observacion.trim() === '') {
      return res.status(400).json({ mensaje: 'La observación no puede estar vacía.' });
    }

    // Buscar si ya existe una observación del mismo usuario sobre esa bitácora
    const yaExiste = await Observacion.findOne({
      where: {
        id_usuario,
        rol_usuario,
        tipo_objetivo: 'bitacora',
        id_objetivo: id_bitacora
      }
    });

    if (yaExiste) {
      // Actualizar la observación
      yaExiste.observacion = observacion;
      yaExiste.mostrar_observacion = mostrar_observacion ?? true;
      yaExiste.fecha_ultima_actualizacion = new Date();
      await yaExiste.save();

      return res.status(200).json({ mensaje: 'Observación actualizada.', data: yaExiste });
    }

    // Crear nueva observación
    const nueva = await Observacion.create({
      id_usuario,
      rol_usuario,
      tipo_objetivo: 'bitacora',
      id_objetivo: id_bitacora,
      observacion,
      mostrar_observacion: mostrar_observacion ?? true,
      fecha_ultima_actualizacion: new Date()
    });

    return res.status(201).json({ mensaje: 'Observación creada.', data: nueva });

  } catch (error) {
    console.error('❌ Error al crear/actualizar observación:', error);
    res.status(500).json({ mensaje: 'Error del servidor', error });
  }
};

exports.verObservacionesDeBitacora = async (req, res) => {
  try {
    const { id_bitacora } = req.params;
    const { rol } = req.usuario;

    const rolesPermitidos = ['Administrador', 'Instructor', 'Aprendiz'];
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