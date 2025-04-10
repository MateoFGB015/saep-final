const Bitacora = require('../models/Bitacora');
const FichaAprendiz = require('../models/FichaAprendiz');



// ⁡⁣⁢⁣​‌‌‍​‌‌‌𝘊͟𝘰͟𝘯͟𝘵͟𝘳͟𝘰͟𝘭͟𝘢͟𝘥͟𝘰͟𝘳͟𝘦͟𝘴 𝘱͟𝘢͟𝘳͟𝘢 𝘈͟𝘱͟𝘳͟𝘦͟𝘯͟𝘥͟𝘪͟𝘻⁡:​

//⁡⁢⁢⁢​‌‌‍𝘚͟𝘶͟𝘣͟𝘪͟𝘳 𝘉͟𝘪͟𝘵͟𝘢͟𝘤͟𝘰͟𝘳͟𝘢​⁡
exports.subirBitacora = async (req, res) => {
  try {
    const { id: id_usuario } = req.usuario;

    // Verificar relación aprendiz-ficha
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
      bitacora: filename, // 👈 Aquí lo estás enviando correctamente
      id_ficha_aprendiz
    });

    res.status(201).json({ mensaje: '✅ Bitácora subida exitosamente.', data: nuevaBitacora });

  } catch (error) {
    console.error('❌ Error al subir bitácora:', error);
    res.status(500).json({ mensaje: 'Error del servidor al subir la bitácora.', error });
  }
};

// ⁡⁣⁣⁢​‌‌‍𝘝͟𝘪͟𝘴͟𝘶͟𝘢͟𝘭͟𝘪͟𝘻͟𝘢͟𝘳 𝘣͟𝘪͟𝘵͟𝘢͟𝘤͟𝘰͟𝘳͟𝘢͟𝘴 𝘴͟𝘶͟𝘣͟𝘪͟𝘥͟𝘢͟𝘴 𝘱͟𝘰͟𝘳 𝘢͟𝘱͟𝘳͟𝘦͟𝘯͟𝘥͟𝘪͟𝘻​⁡
exports.verBitacorasSubidas = async (req, res) => {
    try {
        const { id: id_usuario } = req.usuario;

        const relacion = await FichaAprendiz.findOne({where : {id_usuario }});
        if (!relacion) {
            return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz.' });
        }
        const id_ficha_aprendiz = relacion.id_ficha_aprendiz;

        const bitacoras = await Bitacora.findAll({
            where: { id_ficha_aprendiz },
           order: [['numero_bitacora', 'ASC']]
        });
        res.status(200).json({ bitacoras });
    } catch (error ) {
        console.error('❌ Error al obtener bitácoras:', error);
        res.status(500).json({ mensaje: 'Error del servidor al obtener las bitácoras.', error });
    }
};

// ⁡⁢⁣⁣​‌‌‍​‌‌‌𝘊͟𝘰͟𝘯͟𝘵͟𝘳͟𝘰͟𝘭͟𝘢͟𝘥͟𝘰͟𝘳͟𝘦͟𝘴 𝘎͟𝘦͟𝘯͟𝘦͟𝘳͟𝘢͟𝘭͟𝘦͟𝘴 ⁡​

//⁡⁣⁢⁣​‌‌‍𝘔͟𝘰͟𝘥͟𝘪͟𝘧͟𝘪͟𝘤͟𝘢͟𝘳 𝘉͟𝘪͟𝘵͟𝘢͟𝘤͟𝘰͟𝘳͟𝘢​⁡
exports.modificarBitacora = async (req, res) => {
    try {
      const { id } = req.params;
      const { observacion, estado } = req.body;
  
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

  // ⁡⁢⁣⁢​‌‌‍𝘌͟𝘭͟𝘪͟𝘮͟𝘪͟𝘯͟𝘢͟𝘳 𝘉͟𝘪͟𝘵͟𝘢͟𝘤͟𝘰͟𝘳͟𝘢​⁡
  exports.eliminarBitacora = async (req, res) => {
    try {
      const { id } = req.params;
  
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

  