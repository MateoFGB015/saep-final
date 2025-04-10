const Ficha = require('../models/fichas');
const Usuario = require('../models/usuario');

// ⁡⁣⁣⁢​‌‌‍𝙑͟𝙚͟𝙧 𝙞͟𝙣͟𝙛͟𝙤͟𝙧͟𝙢͟𝙖͟𝙘͟𝙞͟ó͟𝙣 𝙙͟𝙚 𝙪͟𝙣͟𝙖 𝙛͟𝙞͟𝙘͟𝙝͟𝙖​⁡

exports.obtenerInfoFicha = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de ficha inválido' });
  }

  try {
    // 1. Buscar la ficha
    const ficha = await Ficha.findByPk(id);

    if (!ficha) {
      return res.status(404).json({ mensaje: 'Ficha no encontrada' });
    }

    // 2. Buscar aprendices relacionados directamente en ficha_aprendiz
    const aprendices = await ficha.getAprendices({
      attributes: ['id_usuario', 'nombre', 'apellido', 'numero_documento', 'correo_electronico'],
      joinTableAttributes: [] // No queremos datos extras de ficha_aprendiz
    });

    // 3. Buscar el instructor si existe
    let instructor = null;
    if (ficha.id_instructor) {
      instructor = await Usuario.findByPk(ficha.id_instructor, {
        attributes: ['id_usuario', 'nombre', 'apellido', 'numero_documento', 'correo_electronico']
      });
    }

    // 4. Responder con ficha + aprendices + instructor
    res.status(200).json({
      ficha: {
        id_ficha: ficha.id_ficha,
        numero_ficha: ficha.numero_ficha,
        nombre_programa: ficha.nombre_programa,
        termino_programa: ficha.termino_programa,
        inicio_etapa_productiva: ficha.inicio_etapa_productiva,
        fin_etapa_productiva: ficha.fin_etapa_productiva,
        archivar: ficha.archivar,
        instructor: instructor || null
      },
      aprendices
    });

  } catch (error) {
    console.error('Error al obtener la ficha, aprendices e instructor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ​‌‍‌⁡⁢⁣⁣𝘝͟𝘦͟𝘳 𝘧͟𝘪͟𝘤͟𝘩͟𝘢͟𝘴 𝘥͟𝘦 𝘶͟𝘯 𝘪͟𝘯͟𝘴͟𝘵͟𝘳͟𝘶͟𝘤͟𝘵͟𝘰͟𝘳 𝘦͟𝘴͟𝘱͟𝘦͟𝘤͟í͟𝘧͟𝘪͟𝘤͟𝘰⁡​
exports.obtenerFichasInstructor = async (req, res) => {
  try {
    const { id: id_usuario, rol } = req.usuario;

    if (rol !== 'Instructor') {
      return res.status(403).json({ mensaje: 'No tienes permisos para acceder a estas fichas.' });
    }

    const fichas = await Ficha.findAll({
      where: { id_instructor: id_usuario }
    });

    res.status(200).json(fichas);
  } catch (error) {
    console.error('Error al obtener fichas del instructor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


// ⁡⁢⁢⁢​‌‌‍𝙎͟𝙪͟𝙗͟𝙞͟𝙧 𝙛͟𝙞͟𝙘͟𝙝͟𝙖​⁡
exports.crearFicha = async (req, res) => {
  const { numero_ficha, nombre_programa, termino_programa, inicio_etapa_productiva, fin_etapa_productiva, id_instructor } = req.body;

  if (!numero_ficha || !nombre_programa || !id_instructor) {
    return res.status(400).json({ error: "Campos obligatorios faltantes" });
  }

  try {
    const fichaExistente = await Ficha.findOne({ where: { numero_ficha } });

    if (fichaExistente) {
      return res.status(400).json({ error: "La ficha ya existe" });
    }

    const nuevaFicha = await Ficha.create({
      numero_ficha,
      nombre_programa,
      termino_programa,
      inicio_etapa_productiva,
      fin_etapa_productiva,
      id_instructor
    });

    res.status(201).json({ mensaje: "Ficha creada exitosamente", nuevaFicha });
  } catch (error) {
    console.error("Error al crear la ficha:", error);
    res.status(500).json({ error: "Error al crear la ficha" });
  }
};

//⁡⁣⁣⁢​‌‌‍𝙑͟𝙚͟𝙧 𝙩͟𝙤͟𝙙͟𝙖͟𝙨 𝙡͟𝙖͟𝙨 𝙛͟𝙞͟𝙘͟𝙝͟𝙖͟𝙨​⁡
exports.obtenerFichas = async (req, res) => {
  try {
    const fichas = await Ficha.findAll();

    if (fichas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron fichas' });
    }

    res.status(200).json(fichas);
  } catch (error) {
    console.error('Error al obtener las fichas:', error);
    res.status(500).json({ error: 'Error al obtener las fichas' });
  }
};

//⁡⁣⁢⁣​‌‌‍𝙈͟𝙤͟𝙙͟𝙞͟𝙛͟𝙞͟𝙘͟𝙖͟𝙧 𝙛͟𝙞͟𝙘͟𝙝͟𝙖​⁡
exports.actualizarFicha = async (req, res) => {
  const { id } = req.params;
  const { numero_ficha, nombre_programa, termino_programa, inicio_etapa_productiva, fin_etapa_productiva, id_instructor } = req.body;

  try {
    const ficha = await Ficha.findByPk(id);

    if (!ficha) {
      return res.status(404).json({ error: "Ficha no encontrada" });
    }

    await ficha.update({
      numero_ficha,
      nombre_programa,
      termino_programa,
      inicio_etapa_productiva,
      fin_etapa_productiva,
      id_instructor
    });

    res.status(200).json({ mensaje: "Ficha actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la ficha:", error);
    res.status(500).json({ error: "Error al actualizar la ficha" });
  }
};

// ⁡⁢⁣⁢​‌‌‍𝙀͟𝙡͟𝙞͟𝙢͟𝙞͟𝙣͟𝙖͟𝙧 𝙛͟𝙞͟𝙘͟𝙝͟𝙖​⁡
exports.eliminarFicha = async (req, res) => {
  const { id } = req.params;

  try {
    const ficha = await Ficha.findByPk(id);

    if (!ficha) {
      return res.status(404).json({ error: "Ficha no encontrada" });
    }

    await ficha.destroy();

    res.status(200).json({ mensaje: "Ficha eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la ficha:", error);
    res.status(500).json({ error: "Error al eliminar la ficha" });
  }
};

//⁡⁢⁣⁣​‌‌‍𝘼͟𝙧͟𝙘͟𝙝͟𝙞͟𝙫͟𝙖͟𝙧 𝙛͟𝙞͟𝙘͟𝙝͟𝙖​⁡
exports.archivarFicha = async (req, res) => {
  const { id } = req.params;

  try {
    const ficha = await Ficha.findByPk(id);

    if (!ficha) {
      return res.status(404).json({ error: "Ficha no encontrada" });
    }

    await ficha.update({ archivar: true });

    res.status(200).json({ mensaje: "Ficha archivada exitosamente" });
  } catch (error) {
    console.error("Error al archivar la ficha:", error);
    res.status(500).json({ error: "Error al archivar la ficha" });
  }
};
