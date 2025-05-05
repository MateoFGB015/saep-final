const fs = require('fs');
const path = require('path');
const Bitacora = require('../models/Bitacora');
const FichaAprendiz = require('../models/FichaAprendiz');

// Subir Bitácora
exports.subirBitacora = async (req, res) => {
  try {
    const { id: id_usuario, rol } = req.usuario;

    // ✅ Verificar que sea aprendiz o admin
    if (rol !== 'aprendiz' && rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Solo el administrador o el aprendiz pueden subir bitácoras.' });
    }

    // Buscar relación en ficha_aprendiz
    const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });
    if (!relacion) {
      return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al usuario.' });
    }

    const id_ficha_aprendiz = relacion.id_ficha_aprendiz;

    // Calcular número de bitácora
    const cantidad = await Bitacora.count({ where: { id_ficha_aprendiz } });
    const numero_bitacora = cantidad + 1;

    // Validar que haya archivo
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
      estado_bitacora: 1, // 1 = pendiente
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


//Ver bitacoras

exports.verBitacorasSubidas = async (req, res) => {
  try {
    const { id: id_usuario, rol } = req.usuario;
    const { id_usuario: id_usuario_aprendiz } = req.params;


    // Si es aprendiz: ver solo sus propias bitácoras
    if (rol === 'aprendiz') {
      const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });

      if (!relacion) {
        return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz.' });
      }

      const bitacoras = await Bitacora.findAll({
        where: { id_ficha_aprendiz: relacion.id_ficha_aprendiz },
        order: [['numero_bitacora', 'ASC']]
      });

      return res.status(200).json({ bitacoras });
    }

    // Si es admin o instructor: requiere ID del aprendiz
    if ((rol === 'Administrador' || rol === 'Instructor') && id_usuario_aprendiz) {
      const relacion = await FichaAprendiz.findOne({ where: { id_usuario: id_usuario_aprendiz } });

      if (!relacion) {
        return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz.' });
      }

      const bitacoras = await Bitacora.findAll({
        where: { id_ficha_aprendiz: relacion.id_ficha_aprendiz },
        order: [['numero_bitacora', 'ASC']]
      });

      return res.status(200).json({ bitacoras });
    }

    // ❌ Si es admin/instructor pero no manda ID
    return res.status(400).json({ mensaje: 'Debes proporcionar el ID del aprendiz.' });

  } catch (error) {
    console.error('❌ Error al obtener bitácoras:', error);
    res.status(500).json({ mensaje: 'Error del servidor al obtener las bitácoras.', error });
  }
};


// Modificar Bitácora
exports.modificarBitacora = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: id_usuario, rol } = req.usuario;

    // ✅ Solo admin y aprendiz pueden modificar
    if (rol !== 'Administrador' && rol !== 'aprendiz') {
      return res.status(403).json({ mensaje: 'No tienes permisos para modificar esta bitácora.' });
    }

    // Obtener la bitácora actual
    const bitacora = await Bitacora.findByPk(id);
    if (!bitacora) {
      return res.status(404).json({ mensaje: 'Bitácora no encontrada.' });
    }

    // ✅ Si es aprendiz, verificar que la bitácora sea suya
    if (rol === 'aprendiz') {
      const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });
      if (!relacion || relacion.id_ficha_aprendiz !== bitacora.id_ficha_aprendiz) {
        return res.status(403).json({ mensaje: 'No puedes modificar una bitácora que no te pertenece.' });
      }
    }

    // ⚠️ Si hay nuevo archivo, eliminar el anterior
    if (req.file) {
      const rutaAnterior = path.join(__dirname, '..', 'uploads', 'bitacoras', bitacora.bitacora);
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }
      bitacora.bitacora = req.file.filename;
    }

    // Actualizar otros campos (si se envían)
    bitacora.estado_bitacora = 1; // Opcional: siempre marcar como pendiente al modificar
    bitacora.fecha_ultima_actualizacion = new Date();

    await bitacora.save();

    res.status(200).json({ mensaje: '✅ Bitácora modificada correctamente.', bitacora });

  } catch (error) {
    console.error('❌ Error al modificar bitácora:', error);
    res.status(500).json({ mensaje: 'Error del servidor al modificar la bitácora.', error });
  }
};

// Eliminar Bitácora

exports.eliminarBitacora = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.usuario;

    // 🔐 Solo el ADMIN puede eliminar
    if (rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Solo el administrador puede eliminar bitácoras.' });
    }

    // Buscar la bitácora
    const bitacora = await Bitacora.findByPk(id);
    if (!bitacora) {
      return res.status(404).json({ mensaje: 'Bitácora no encontrada.' });
    }

    // Eliminar archivo del sistema si existe
    const rutaArchivo = path.join(__dirname, '..', 'uploads', 'bitacoras', bitacora.bitacora);
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    // Eliminar registro en la base de datos
    await Bitacora.destroy({ where: { id_bitacora: id } });

    res.status(200).json({ mensaje: '✅ Bitácora eliminada correctamente.' });

  } catch (error) {
    console.error('❌ Error al eliminar bitácora:', error);
    res.status(500).json({ mensaje: 'Error del servidor al eliminar la bitácora.', error });
  }
};
exports.agregarObservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { observacion } = req.body;
    const { rol } = req.usuario;

    if (rol !== 'Administrador' && rol !== 'Instructor') {
      return res.status(403).json({ mensaje: 'Solo el administrador o instructor pueden hacer observaciones.' });
    }

    const bitacora = await Bitacora.findByPk(id);
    if (!bitacora) {
      return res.status(404).json({ mensaje: 'Bitácora no encontrada.' });
    }

    bitacora.observacion = observacion;
    bitacora.estado_bitacora = 2; // Por ejemplo, 2 = Observada
    bitacora.fecha_ultima_actualizacion = new Date();

    await bitacora.save();

    res.status(200).json({ mensaje: '✅ Observación registrada.', bitacora });

  } catch (error) {
    console.error('❌ Error al agregar observación:', error);
    res.status(500).json({ mensaje: 'Error del servidor al agregar observación.', error });
  }
};