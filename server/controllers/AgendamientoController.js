const modeloAgendamiento = require('../models/Agendamiento'); 
const modeloUsuario = require('../models/usuario'); 
const FichaAprendiz = require('../models/FichaAprendiz'); 
const modeloAprendiz = require('../models/Aprendiz');
const modeloEmpresa = require('../models/Empresa');
const modeloFicha = require('../models/fichas');
const { crearNotificacion, crearNotificacionesLote } = require('../service/notificacionservice');
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

    const visitasExistentes = await modeloAgendamiento.count({
      where: { id_ficha_aprendiz }
    });

    if (visitasExistentes >= 3) {
      return res.status(400).json({ mensaje: "Este aprendiz ya tiene 3 visitas agendadas" });
    }

    const { Op } = require('sequelize');
    const traslape = await modeloAgendamiento.findOne({
      where: {
        id_instructor: instructorId,
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
      return res.status(400).json({
        mensaje: "El instructor ya tiene una visita en ese horario"
      });
    }

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

    // ✅ Crear la notificación para el aprendiz
    await crearNotificacion({
      id_usuario: fichaAprendiz.id_usuario, 
      tipo: 'Información',
      titulo: 'Nueva visita agendada',
      mensaje: 'Tu instructor ha agendado una nueva visita contigo.'
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

    const agendamiento = await modeloAgendamiento.findByPk(id, {
      include: {
        model: FichaAprendiz,
        as: 'ficha_aprendiz'
      }
    });

    if (!agendamiento) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    if (agendamiento.id_instructor !== instructorId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este agendamiento' });
    }

    const { fecha_inicio, fecha_fin } = req.body;

    const traslape = await modeloAgendamiento.findOne({
      where: {
        id_instructor: instructorId,
        id_agendamiento: { [Op.ne]: id },
        [Op.or]: [
          { fecha_inicio: { [Op.lte]: fecha_inicio }, fecha_fin: { [Op.gt]: fecha_inicio } },
          { fecha_inicio: { [Op.lt]: fecha_fin }, fecha_fin: { [Op.gte]: fecha_fin } },
          { fecha_inicio: { [Op.gte]: fecha_inicio }, fecha_fin: { [Op.lte]: fecha_fin } }
        ]
      }
    });
    if (traslape) {
      return res.status(400).json({ mensaje: 'Ya tienes una visita en ese horario' });
    }

    await agendamiento.update(req.body);

    const idAprendiz = agendamiento.ficha_aprendiz?.id_usuario;

    if (idAprendiz) {
      await crearNotificacion({
        id_usuario: idAprendiz,
        tipo: 'Información',
        titulo: 'Visita actualizada',
        mensaje: 'Tu instructor ha modificado la programación de tu visita.'
      });
    }

    res.json({ mensaje: 'Agendamiento actualizado correctamente' });
  } catch (error) {
    console.error('Error al modificar agendamiento:', error);
    res.status(500).json({ mensaje: 'Error al modificar agendamiento', error });
  }
};

// Eliminar agendamiento (solo si es del instructor autenticado)
exports.eliminarAgendamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.usuario.id;

    const agendamiento = await modeloAgendamiento.findByPk(id, {
      include: {
        model: FichaAprendiz,
        as: 'ficha_aprendiz'
      }
    });

    if (!agendamiento) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    if (agendamiento.id_instructor !== instructorId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este agendamiento' });
    }

    // ✅ Obtener el ID del aprendiz correctamente
    const idAprendiz = agendamiento.ficha_aprendiz?.id_usuario;

    // ✅ Elimina el agendamiento
    await agendamiento.destroy();

    // ✅ Genera notificación al aprendiz informando la cancelación
    if (idAprendiz) {
      await crearNotificacion({
        id_usuario: idAprendiz,
        tipo: 'Alerta',
        titulo: 'Visita cancelada',
        mensaje: 'Tu instructor ha cancelado una visita que estaba programada contigo.'
      });
    }

    res.json({ mensaje: 'Agendamiento eliminado y notificación enviada al aprendiz' });
  } catch (error) {
    console.error('Error al eliminar agendamiento:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el agendamiento', error });
  }
};



exports.crearAgendamientoPorAdmin = async (req, res) => {
  try {
    const idInstructor = parseInt(req.params.idInstructor, 10);

    const {
      id_ficha_aprendiz,
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      tipo_visita,
      numero_visita
    } = req.body;

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

    const fichaApr = await FichaAprendiz.findByPk(id_ficha_aprendiz);
    if (!fichaApr) {
      return res.status(404).json({ mensaje: 'FichaAprendiz no encontrada' });
    }

    const contador = await modeloAgendamiento.count({ where: { id_ficha_aprendiz } });
    if (contador >= 3) {
      return res.status(400).json({ mensaje: 'Ya tiene 3 visitas agendadas' });
    }

    const traslape = await modeloAgendamiento.findOne({
      where: {
        id_instructor: idInstructor,
        [Op.or]: [
          { fecha_inicio: { [Op.lte]: fecha_inicio }, fecha_fin: { [Op.gt]: fecha_inicio } },
          { fecha_inicio: { [Op.lt]: fecha_fin }, fecha_fin: { [Op.gte]: fecha_fin } },
          { fecha_inicio: { [Op.gte]: fecha_inicio }, fecha_fin: { [Op.lte]: fecha_fin } }
        ]
      }
    });
    if (traslape) {
      return res.status(400).json({ mensaje: 'El instructor ya tiene una visita en ese horario' });
    }

    const nuevo = await modeloAgendamiento.create({
      id_instructor: idInstructor,
      id_ficha_aprendiz,
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      tipo_visita,
      numero_visita,
      estado_visita: 'pendiente'
    });

    // ✅ Crear notificaciones para instructor y aprendiz
    await crearNotificacionesLote([idInstructor, fichaApr.id_usuario], {
      tipo: 'Información',
      titulo: 'Nuevo agendamiento creado',
      mensaje: 'Se ha creado un nuevo agendamiento por el administrador.',
      estado: 'NoLeida'
    });

    return res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

exports.modificarAgendamientoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;

    if (usuario.rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este agendamiento' });
    }

const agendamiento = await modeloAgendamiento.findByPk(id, {
  include: {
    model: FichaAprendiz,
    as: 'ficha_aprendiz'
  }
});

   if (!agendamiento) return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });

    const { fecha_inicio, fecha_fin } = req.body;
    const traslape = await modeloAgendamiento.findOne({
      where: {
        id_instructor: agendamiento.id_instructor,
        id_agendamiento: { [Op.ne]: id },
        [Op.or]: [
          { fecha_inicio: { [Op.lte]: fecha_inicio }, fecha_fin: { [Op.gt]: fecha_inicio } },
          { fecha_inicio: { [Op.lt]: fecha_fin }, fecha_fin: { [Op.gte]: fecha_fin } },
          { fecha_inicio: { [Op.gte]: fecha_inicio }, fecha_fin: { [Op.lte]: fecha_fin } }
        ]
      }
    });
    if (traslape) {
      return res.status(400).json({ mensaje: 'El instructor ya tiene una visita en ese horario' });
    }

const idAprendiz = agendamiento.ficha_aprendiz?.id_usuario;

await agendamiento.update(req.body);

await crearNotificacionesLote([agendamiento.id_instructor, idAprendiz], {
  tipo: 'Información',
  titulo: 'Agendamiento actualizado',
  mensaje: 'Un agendamiento ha sido modificado por el administrador.',
  estado: 'NoLeida'
});

    res.json({ mensaje: 'Agendamiento actualizado correctamente' });
  } catch (error) {
    console.error('❗ Error al modificar agendamiento:', error);
    res.status(500).json({ mensaje: 'Error al modificar agendamiento', error });
  }
};

exports.eliminarAgendamientoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;

    if (usuario.rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este agendamiento' });
    }

    const agendamiento = await modeloAgendamiento.findOne({
      where: { id_agendamiento: id },
      include: [
        { model: modeloUsuario, as: 'instructor' },
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
    });

    if (!agendamiento) {
      return res.status(404).json({ mensaje: 'Agendamiento no encontrado' });
    }

    await agendamiento.destroy();

    // ✅ Crear notificaciones para instructor y aprendiz
    await crearNotificacionesLote([agendamiento.id_instructor, agendamiento.ficha_aprendiz.id_usuario], {
      tipo: 'Información',
      titulo: 'Agendamiento cancelado',
      mensaje: 'Un agendamiento ha sido cancelado por el administrador.',
      estado: 'NoLeida'
    });

    res.json({ mensaje: 'Agendamiento cancelado correctamente' });
  } catch (error) {
    console.error("Error al eliminar agendamiento por admin:", error);
    res.status(500).json({ mensaje: 'Error al eliminar agendamiento', error });
  }
};


exports.obtenerVisitasPorFichaAprendiz = async (req, res) => {
  try {
    const { id } = req.params;

    const visitas = await modeloAgendamiento.findAll({
      where: { id_ficha_aprendiz: id },
      attributes: ['numero_visita'],
      order: [['numero_visita', 'ASC']]
    });

    const numeros = visitas.map(v => v.numero_visita);

    res.json(numeros);
  } catch (error) {
    console.error("Error al obtener visitas:", error);
    res.status(500).json({ mensaje: "Error al obtener visitas del aprendiz", error });
  }
};
