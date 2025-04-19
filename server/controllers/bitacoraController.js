const Bitacora = require('../models/Bitacora');
const FichaAprendiz = require('../models/FichaAprendiz');

// Verificar permisos según rol
const verificarRol = (role, requiredRoles) => {
  return requiredRoles.includes(role);
};

// Subir Bitácora
exports.subirBitacora = async (req, res) => {
  try {
    const { id: id_usuario, rol } = req.usuario;

    // Verificar si el usuario es un aprendiz
    const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });
    if (!relacion) {
      return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz.' });
    }
    const id_ficha_aprendiz = relacion.id_ficha_aprendiz;

    // Calcular número de bitácora
    const cantidad = await Bitacora.count({ where: { id_ficha_aprendiz } });
    const numero_bitacora = cantidad + 1;

    // Validar archivo subido
    if (!req.file) {
      return res.status(400).json({ mensaje: 'Debes subir un archivo.' });
    }

    const { filename } = req.file;

    console.log("📝 Nombre del archivo que se va a guardar:", filename);
    console.log('📦 Archivo recibido:', req.file);

    // Crear registro
    const nuevaBitacora = await Bitacora.create({
      numero_bitacora,
      observacion: 'Sin observaciones',
      estado_bitacora: 1, // Asumiendo que 1 = pendiente
      fecha_ultima_actualizacion: new Date(),
      bitacora: filename,
      id_ficha_aprendiz
    });

    res.status(201).json({ mensaje: '✅ Bitácora subida exitosamente.', data: nuevaBitacora });

  } catch (error) {
    console.error('❌ Error al subir bitácora:', error);
    res.status(500).json({ mensaje: 'Error del servidor al subir la bitácora.', error });
  }
};

// Ver Bitácoras
exports.verBitacorasSubidas = async (req, res) => {
  try {
    const { id: id_usuario, rol } = req.usuario;

    const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });
    if (!relacion) {
      return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz.' });
    }
    const id_ficha_aprendiz = relacion.id_ficha_aprendiz;

    // Filtrar por rol
    if (rol === 'aprendiz') {
      const bitacoras = await Bitacora.findAll({
        where: { id_ficha_aprendiz },
        order: [['numero_bitacora', 'ASC']]
      });
      res.status(200).json({ bitacoras });
    } else if (rol === 'admin' || rol === 'instructor') {
      const bitacoras = await Bitacora.findAll({
        order: [['numero_bitacora', 'ASC']]
      });
      res.status(200).json({ bitacoras });
    } else {
      res.status(403).json({ mensaje: 'No tienes permisos para ver estas bitácoras.' });
    }
  } catch (error) {
    console.error('❌ Error al obtener bitácoras:', error);
    res.status(500).json({ mensaje: 'Error del servidor al obtener las bitácoras.', error });
  }
};

// Modificar Bitácora
exports.modificarBitacora = async (req, res) => {
  try {
    const { id } = req.params;
    const { observacion, estado } = req.body;
    const { rol } = req.usuario;

    if (rol !== 'admin' && rol !== 'instructor') {
      return res.status(403).json({ mensaje: 'No tienes permisos para modificar esta bitácora.' });
    }

    const [actualizado] = await Bitacora.update(
      {
        observacion,
        estado
      },
      {
        where: { id_bitacora: id }
      }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Bitácora no encontrada' });
    }

    const bitacoraActualizada = await Bitacora.findByPk(id);
    res.status(200).json({ mensaje: 'Bitácora actualizada', bitacoraActualizada });

  } catch (error) {
    console.error('❌ Error al actualizar bitácora:', error);
    res.status(500).json({ mensaje: 'Error del servidor al actualizar la bitácora', error });
  }
};

// Eliminar Bitácora
exports.eliminarBitacora = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.usuario;

    if (rol !== 'admin' && rol !== 'instructor') {
      return res.status(403).json({ mensaje: 'No tienes permisos para eliminar esta bitácora.' });
    }

    const eliminado = await Bitacora.destroy({
      where: { id_bitacora: id }
    });

    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Bitácora no encontrada' });
    }
    res.status(200).json({ mensaje: 'Bitácora eliminada correctamente' });

  } catch (error) {
    console.error('❌ Error al eliminar bitácora:', error);
    res.status(500).json({ mensaje: 'Error del servidor al eliminar la bitácora', error });
  }
};
