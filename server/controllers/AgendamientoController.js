const modeloAgendamiento = require('../models/Agendamiento'); 
const modeloUsuario = require('../models/usuario'); 
const FichaAprendiz = require('../models/FichaAprendiz'); 
const modeloAprendiz = require('../models/Aprendiz');
const modeloEmpresa = require('../models/Empresa');
const modeloFicha = require('../models/fichas');
const { Op } = require('sequelize');

// Agendamientos del instructor autenticado
exports.obtenerAgendamientosInstructor = async (req, res) => {
  try {
    const instructorId = req.usuario.id;

    const agendamientos = await modeloAgendamiento.findAll({
      where: { id_instructor: instructorId },
      include: [
        { model: modeloUsuario, as: 'instructor' },
        {
          model: FichaAprendiz,
          as: 'ficha_aprendiz',
          include: [{
            model: modeloUsuario,
            as: 'aprendiz',
            include: [{ model: modeloAprendiz, as: 'detalle_aprendiz' }]
          }]
        }
      ]
    });

    res.json(agendamientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener agendamientos del instructor', error });
  }
};

// ✅ Controlador - Obtener agendamientos del aprendiz autenticado
exports.obtenerAgendamientosAprendiz = async (req, res) => {
  try {
    const aprendizId = req.usuario.id;

    // Buscar las relaciones ficha-aprendiz para ese usuario
    const fichasAprendiz = await FichaAprendiz.findAll({
      where: { id_usuario: aprendizId },
      include: [{
        model: modeloAgendamiento,
        as: 'agendamientos', // alias correcto según la relación en los modelos
        include: [
          {
            model: modeloUsuario,
            as: 'instructor'
          },
          {
            model: FichaAprendiz,
            as: 'ficha_aprendiz',
            include: [
              {
                model: modeloUsuario,
                as: 'aprendiz',
                include: [{
                  model: modeloAprendiz,
                  as: 'detalle_aprendiz',
                  include: [{ model: modeloEmpresa, as: 'empresa' }]
                }]
              }
            ]
          }
        ]
      }]
    });

    // Extraer solo los agendamientos de las relaciones encontradas
    const agendamientos = fichasAprendiz.flatMap(fa => fa.agendamientos);

    res.json(agendamientos);
  } catch (error) {
    console.error("Error al obtener agendamientos del aprendiz:", error);
    res.status(500).json({ mensaje: 'Error al obtener agendamientos del aprendiz', error });
  }
};

exports.obtenerAgendamientosPorInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario; // Ya viene del token gracias a tu middleware

    if (usuario.rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver los agendamientos de otro instructor' });
    }

    const agendamientos = await modeloAgendamiento.findAll({
      where: { id_instructor: id },
      include: [
        { model: modeloUsuario, as: 'instructor' },
        {
          model: FichaAprendiz,
          as: 'ficha_aprendiz',
          include: [
            {
              model: modeloUsuario,
              as: 'aprendiz',
              include: [{ model: modeloAprendiz, as: 'detalle_aprendiz' }]
            }
          ]
        }
      ]
    });

    res.json(agendamientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los agendamientos', error });
  }
};


// Crear agendamiento (solo para el instructor autenticado)
exports.crearAgendamiento = async (req, res) => {
  try {
    const instructorId = req.usuario.id;

    const {
      id_ficha_aprendiz,
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      estado_visita = "pendiente",
      tipo_visita,
      numero_visita
    } = req.body;

    if (
      !id_ficha_aprendiz || !herramienta_reunion || !enlace_reunion ||
      !fecha_inicio || !fecha_fin || !tipo_visita || numero_visita === undefined
    ) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const fichaAprendiz = await FichaAprendiz.findByPk(id_ficha_aprendiz);
    if (!fichaAprendiz) {
      return res.status(404).json({ mensaje: "FichaAprendiz no encontrada" });
    }

    // ✅ Verificar que no tenga más de 3 visitas
    const visitasExistentes = await modeloAgendamiento.count({
      where: { id_ficha_aprendiz }
    });

    if (visitasExistentes >= 3) {
      return res.status(400).json({ mensaje: "Este aprendiz ya tiene 3 visitas agendadas" });
    }

    // ✅ Validar traslape de horarios
    const { Op } = require('sequelize');
    const traslape = await modeloAgendamiento.findOne({
      where: {
        id_ficha_aprendiz,
        [Op.or]: [
          {
            fecha_inicio: { [Op.lte]: fecha_inicio },
            fecha_fin: { [Op.gt]: fecha_inicio }
          },
          {
            fecha_inicio: { [Op.lt]: fecha_fin },
            fecha_fin: { [Op.gte]: fecha_fin }
          },
          {
            fecha_inicio: { [Op.gte]: fecha_inicio },
            fecha_fin: { [Op.lte]: fecha_fin }
          }
        ]
      }
    });

    if (traslape) {
      return res.status(400).json({ mensaje: "Ya existe una visita para este aprendiz en ese horario" });
    }

    // ✅ Crear agendamiento
    const nuevoAgendamiento = await modeloAgendamiento.create({
      id_ficha_aprendiz,
      id_instructor: instructorId,
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
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Obtener aprendices por ficha
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

    const aprendices = fichaAprendices.map((fa) => ({
      id_aprendiz: fa.aprendiz.id_usuario,
      nombre: fa.aprendiz.nombre,
      apellido: fa.aprendiz.apellido,
      id_ficha_aprendiz: fa.id_ficha_aprendiz,
    }));

    res.json(aprendices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener aprendices", error });
  }
};

// Obtener fichas activas
exports.obtenerFichas = async (req, res) => {
  try {
    const fichas = await modeloFicha.findAll({
      attributes: ["id_ficha", "numero_ficha", "nombre_programa"],
      where: { archivar: false },
    });

    res.json(fichas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener fichas", error });
  }
};

// Modificar agendamiento (solo si es del instructor autenticado)
exports.modificarAgendamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.usuario.id;

    const agendamiento = await modeloAgendamiento.findByPk(id);
    if (!agendamiento) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    if (agendamiento.id_instructor !== instructorId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este agendamiento' });
    }

    await agendamiento.update(req.body);

    const actualizado = await modeloAgendamiento.findOne({
      where: { id_agendamiento: id },
      include: [
        { model: modeloUsuario, as: 'instructor' },
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

    res.json(actualizado);
  } catch (error) {
    console.error("Error al modificar el agendamiento:", error);
    res.status(500).json({ mensaje: 'Error al modificar el agendamiento', error });
  }
};

// Eliminar agendamiento (solo si es del instructor autenticado)
exports.eliminarAgendamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.usuario.id;

    const agendamiento = await modeloAgendamiento.findByPk(id);
    if (!agendamiento) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    if (agendamiento.id_instructor !== instructorId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este agendamiento' });
    }

    await agendamiento.destroy();
    res.json({ mensaje: 'Agendamiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el agendamiento', error });
  }
};


exports.crearAgendamientoPorAdmin = async (req, res) => {
  try {
    // 1️⃣ Tomamos el id del instructor desde la URL
    const idInstructor = parseInt(req.params.idInstructor, 10);

    // 2️⃣ Campos esperados en el body
    const {
      id_ficha_aprendiz,
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      tipo_visita,
      numero_visita
    } = req.body;

    // Validaciones
    if (
      !id_ficha_aprendiz ||
      !herramienta_reunion ||
      !enlace_reunion ||
      !fecha_inicio ||
      !fecha_fin ||
      !tipo_visita ||
      numero_visita == null
    ) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Verificar existencia de ficha-aprendiz
    const fichaApr = await FichaAprendiz.findByPk(id_ficha_aprendiz);
    if (!fichaApr) {
      return res.status(404).json({ mensaje: 'FichaAprendiz no encontrada' });
    }

    // Máximo 3 visitas
    const contador = await modeloAgendamiento.count({ where: { id_ficha_aprendiz } });
    if (contador >= 3) {
      return res.status(400).json({ mensaje: 'Ya tiene 3 visitas agendadas' });
    }

    // Verificar traslapes
    const traslape = await modeloAgendamiento.findOne({
      where: {
        id_ficha_aprendiz,
        [Op.or]: [
          { fecha_inicio: { [Op.lte]: fecha_inicio }, fecha_fin: { [Op.gt]: fecha_inicio } },
          { fecha_inicio: { [Op.lt]: fecha_fin },   fecha_fin: { [Op.gte]: fecha_fin } },
          { fecha_inicio: { [Op.gte]: fecha_inicio }, fecha_fin: { [Op.lte]: fecha_fin } },
        ]
      }
    });
    if (traslape) {
      return res.status(400).json({ mensaje: 'Hay una visita en ese horario' });
    }

    // Crear
    const nuevo = await modeloAgendamiento.create({
      id_instructor:      idInstructor,
      id_ficha_aprendiz,
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      tipo_visita,
      numero_visita,
      estado_visita: 'pendiente'
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

