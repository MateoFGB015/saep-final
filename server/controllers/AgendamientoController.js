const modeloAgendamiento = require('../models/Agendamiento'); 
const modeloUsuario = require('../models/usuario'); 
const FichaAprendiz = require('../models/FichaAprendiz'); 
const modeloAprendiz = require('../models/Aprendiz');
const modeloEmpresa = require('../models/Empresa');
const modeloFicha = require('../models/fichas');


//Obtener todos los agendamientos con detalles
exports.obtenerAgendamientos = async (req, res) => {
  try {
    const agendamientos = await modeloAgendamiento.findAll({
      include: [
        { model: modeloUsuario, as: 'instructor' }, // Incluir el instructor
        { 
          model: FichaAprendiz, 
          as: 'ficha_aprendiz',
          include: [{ 
            model: modeloUsuario, 
            as: 'aprendiz', 
            include: [{ 
              model: modeloAprendiz, 
              as: 'detalle_aprendiz', 
              include: [{ model: modeloEmpresa, as: 'empresa' }] 
            }]
          }]
        }
      ]
    });

    if (!agendamientos || agendamientos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron agendamientos.' });
    }

    res.json(agendamientos);
  } catch (error) {
    console.error("Error al obtener agendamientos:", error);

    if (error.name === 'SequelizeEagerLoadingError') {
      return res.status(500).json({
        mensaje: 'Error en la carga de relaciones. Verifica las asociaciones en Sequelize.',
        error: error.message
      });
    } 
    res.status(500).json({
      mensaje: 'Error interno del servidor al obtener los agendamientos.',
      error: error.message
    });
  }
};

/*------------------------------------------------------------------------------------------------------------------------------------*/

// Obtener un agendamiento por ID con detalles
exports.obtenerAgendamientoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamiento = await modeloAgendamiento.findOne({
      where: { id_agendamiento: id },
      include: [
        { model: Usuario, as: 'instructor' }, 
        { model: FichaAprendiz, as: 'ficha_aprendiz' }
      ]
    });

    if (!agendamiento) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    res.json(agendamiento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el agendamiento', error });
  }
};

/*------------------------------------------------------------------------------------------------------------------------------------*/

// Crear un nuevo agendamiento con validaciones
exports.crearAgendamiento = async (req, res) => {
  try {
    const {
      id_ficha_aprendiz,
      id_instructor,
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      estado_visita = "pendiente",
      tipo_visita,
      numero_visita
    } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!id_ficha_aprendiz || !id_instructor || !herramienta_reunion || !enlace_reunion ||
        !fecha_inicio || !fecha_fin || !estado_visita || !tipo_visita || numero_visita === undefined) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Verificar que id_ficha_aprendiz existe
    const fichaAprendiz = await FichaAprendiz.findByPk(id_ficha_aprendiz);
    if (!fichaAprendiz) {
      return res.status(404).json({ mensaje: "FichaAprendiz no encontrada" });
    }

    // Verificar que id_instructor existe
    const instructor = await modeloUsuario.findByPk(id_instructor);
    if (!instructor) {
      return res.status(404).json({ mensaje: "Instructor no encontrado" });
    }

    // Validar que numero_visita sea un número entre 1 y 3
    if (typeof numero_visita !== 'number' || numero_visita < 1 || numero_visita > 3) {
      return res.status(400).json({ mensaje: "El número de visita debe estar entre 1 y 3" });
    }

    // Crear el agendamiento con todos los datos validados
    const nuevoAgendamiento = await modeloAgendamiento.create({
      id_ficha_aprendiz,
      id_instructor,
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      estado_visita,
      tipo_visita,
      numero_visita
    });

    res.status(201).json(nuevoAgendamiento);
  } catch (error) {
    console.error("Error al crear el agendamiento:", error);

    // Manejo de errores específicos de Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ mensaje: "Error de validación", errores: error.errors });
    }

    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
};


/*------------------------------------------------------------------------------------------------------------------------------------*/

//esto se usa para que al abrir el modal de crear agendamiento en el select me obtenga las fichas que ya existen, ya que obviamente no se crea una nueva ficha.
exports.obtenerFichas = async (req, res) => {
  try {
    const fichas = await modeloFicha.findAll({
      attributes: ["id_ficha", "numero_ficha", "nombre_programa"], // Solo los datos necesarios
      where: { archivar: false }, // No mostrar fichas archivadas
    });
    
    res.json(fichas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener fichas", error });
  }
};

//esto muestra los aprendices en el selecet del modal crear, se muestran los que existen en la ficha que se selecciono antes.
exports.obtenerAprendicesPorFicha = async (req, res) => {
  try {
    const { id_ficha } = req.params;

    const fichaAprendices = await FichaAprendiz.findAll({
      where: { id_ficha },
      include: {
        model: modeloUsuario,
        as: "aprendiz",
        attributes: ["id_usuario", "nombre", "apellido"],
      },
    });

    if (!fichaAprendices.length) {
      return res.status(404).json({ mensaje: "No hay aprendices en esta ficha" });
    }

    // Formatear la respuesta correctamente
    const aprendices = fichaAprendices.map((fa) => ({
      id_aprendiz: fa.aprendiz.id_usuario,
      nombre: fa.aprendiz.nombre,
      apellido: fa.aprendiz.apellido,
      id_ficha_aprendiz: fa.id_ficha_aprendiz, // <= Agrega esto
    }));
    

    res.json(aprendices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener aprendices", error });
  }
};

/*------------------------------------------------------------------------------------------------------------------------------------*/

// Modificar un agendamiento
exports.modificarAgendamiento = async (req, res) => {
  try {
    const { id } = req.params;

    // Intentar actualizar el agendamiento
    const [actualizado] = await modeloAgendamiento.update(req.body, {
      where: { id_agendamiento: id }
    });

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    // Obtener el agendamiento actualizado con todas las relaciones
    const agendamientoActualizado = await modeloAgendamiento.findOne({
      where: { id_agendamiento: id },
      include: [
        { model: modeloUsuario, as: 'instructor' }, // Incluir el instructor
        { 
          model: FichaAprendiz, 
          as: 'ficha_aprendiz',
          include: [{ 
            model: modeloUsuario, 
            as: 'aprendiz', 
            include: [{ 
              model: modeloAprendiz, 
              as: 'detalle_aprendiz', 
              include: [{ model: modeloEmpresa, as: 'empresa' }] 
            }]
          }]
        }
      ]
    });

    res.json(agendamientoActualizado);
  } catch (error) {
    console.error("Error al modificar el agendamiento:", error);
    res.status(500).json({ mensaje: 'Error al modificar el agendamiento', error });
  }
};

/*------------------------------------------------------------------------------------------------------------------------------------*/

// Eliminar un agendamiento
exports.eliminarAgendamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await modeloAgendamiento.destroy({ where: { id_agendamiento: id } });

    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    res.json({ mensaje: 'Agendamiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el agendamiento', error });
  }
};