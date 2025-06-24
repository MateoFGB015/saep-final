const FichaAprendiz = require('../models/FichaAprendiz');
const Ficha = require('../models/fichas');
const Usuario = require('../models/usuario');
const Agendamiento = require('../models/Agendamiento');
const Empresa = require('../models/Empresa');
const Aprendiz = require('../models/Aprendiz');
const { Op } = require('sequelize');



// Elimina la relación entre un aprendiz y una ficha
exports.eliminarAprendizDeFicha = async (req, res) => {
  const { id_ficha, id_usuario } = req.params;

  try {
    const fichaAprendiz = await FichaAprendiz.findOne({
      where: { id_ficha, id_usuario },
    });

    if (!fichaAprendiz) {
      return res.status(404).json({ mensaje: 'Aprendiz no encontrado en la ficha' });
    }

    // Eliminar agendamientos relacionados
    await Agendamiento.destroy({
      where: { id_ficha_aprendiz: fichaAprendiz.id_ficha_aprendiz },
    });

    // Ahora sí, eliminar la relación ficha-aprendiz
    await fichaAprendiz.destroy();

    res.status(200).json({ mensaje: 'Aprendiz eliminado de la ficha correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar aprendiz de ficha:', error);
    res.status(500).json({ mensaje: 'Error al eliminar aprendiz de ficha' });
  }
};

  
  exports.obtenerAprendizDeFicha = async (req, res) => {
    const { id_ficha, id_usuario } = req.params;
  
    try {
      const relacion = await FichaAprendiz.findOne({
        where: { id_ficha, id_usuario },
        include: {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'apellido', 'correo_electronico', 'telefono']
        }
      });
  
      if (!relacion) {
        return res.status(404).json({ mensaje: "No se encontró esta relación ficha-aprendiz" });
      }
  
      res.status(200).json({ aprendiz: relacion.usuario });
    } catch (error) {
      console.error("❌ Error al obtener aprendiz:", error);
      res.status(500).json({ mensaje: "Error del servidor al buscar aprendiz" });
    }
  };
  

exports.crearEmpresa = async (req, res) => {
  try {
    const { nit, razon_social, telefono, correo_electronico, direccion } = req.body;

    // Validar campos obligatorios
    if (!nit || !razon_social || !correo_electronico) {
      return res.status(400).json({ mensaje: 'NIT, razón social y correo electrónico son obligatorios.' });
    }

    // Verificar si ya existe una empresa con ese NIT o correo
    const empresaExistente = await Empresa.findOne({
      where: {
        [Op.or]: [
          { nit },
          { correo_electronico }
        ]
      }
    });

    if (empresaExistente) {
      return res.status(409).json({ mensaje: 'Ya existe una empresa con ese NIT o correo electrónico.' });
    }

    const nuevaEmpresa = await Empresa.create({
      nit,
      razon_social,
      telefono,
      correo_electronico,
      direccion
    });

    return res.status(201).json({ mensaje: 'Empresa creada correctamente.', data: nuevaEmpresa });
  } catch (error) {
    console.error('❌ Error al crear empresa:', error);
    return res.status(500).json({ mensaje: 'Error al crear empresa.', error });
  }
};


exports.obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll({
      order: [['razon_social', 'ASC']] // Orden alfabético por nombre de empresa
    });

    return res.status(200).json(empresas);
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error);
    return res.status(500).json({ mensaje: 'Error al obtener empresas.', error });
  }
};

exports.obtenerEmpresaDelAprendiz = async (req, res) => {
  try {
    const { idAprendiz } = req.params; // Este será el id_usuario del aprendiz
    const { id: idUsuario, rol } = req.usuario;

    let idUsuarioFinal;

    if (idAprendiz) {
      // Solo admin o instructor pueden consultar empresas de otros aprendices
      if (rol !== 'Administrador' && rol !== 'Instructor') {
        return res.status(403).json({ mensaje: 'No tienes permiso para consultar la empresa de otros aprendices.' });
      }
      idUsuarioFinal = idAprendiz;
    } else {
      // Si no se envía el parámetro, debe ser un aprendiz viendo su propia empresa
      if (rol !== 'aprendiz') {
        return res.status(400).json({ mensaje: 'Debes proporcionar un idAprendiz si no eres aprendiz.' });
      }
      idUsuarioFinal = idUsuario;
    }

    // ✅ Buscar al aprendiz por su id_usuario
    const aprendiz = await Aprendiz.findOne({
      where: { id_usuario: idUsuarioFinal },
      include: { model: Empresa, as: 'empresa' }
    });

    if (!aprendiz) return res.status(404).json({ mensaje: 'Aprendiz no encontrado.' });

    res.status(200).json({ empresa: aprendiz.empresa });
  } catch (error) {
    console.error('❌ Error al obtener empresa del aprendiz:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.', error });
  }
};


exports.asignarEmpresaAUnAprendiz = async (req, res) => {
  try {
    let { idAprendiz } = req.params;
    const { id_empresa, alternativa, cargo_empresa, jefe_inmediato } = req.body;
    const { id: idUsuario, rol } = req.usuario;

    // Si NO envían idAprendiz → el aprendiz se asigna a sí mismo
    if (!idAprendiz) {
      if (rol !== 'aprendiz') {
        return res.status(400).json({ mensaje: 'Debes proporcionar un idAprendiz si no eres aprendiz.' });
      }
      idAprendiz = idUsuario;  // ✔ Usar el id_usuario del token
    } else {
      // Si envían idAprendiz → solo Admin o Instructor puede asignar
      if (rol !== 'Administrador' && rol !== 'Instructor') {
        return res.status(403).json({ mensaje: 'No tienes permiso para asignar empresa a otros aprendices.' });
      }
    }

    // Validar que la empresa exista
    const empresa = await Empresa.findByPk(id_empresa);
    if (!empresa) return res.status(404).json({ mensaje: 'Empresa no encontrada.' });

    // Buscar al aprendiz o crearlo si no existe
    let aprendiz = await Aprendiz.findOne({ where: { id_usuario: idAprendiz } });

    if (!aprendiz) {
      aprendiz = await Aprendiz.create({
        id_usuario: idAprendiz,
        id_empresa,
        alternativa: alternativa || null,
        cargo_empresa: cargo_empresa || null,
        jefe_inmediato: jefe_inmediato || null
      });
    } else {
      // Si ya existe → actualizamos los campos
      aprendiz.id_empresa = id_empresa;
      if (alternativa !== undefined) aprendiz.alternativa = alternativa;
      if (cargo_empresa !== undefined) aprendiz.cargo_empresa = cargo_empresa;
      if (jefe_inmediato !== undefined) aprendiz.jefe_inmediato = jefe_inmediato;
      await aprendiz.save();
    }

    return res.status(200).json({ mensaje: 'Empresa asignada correctamente.', aprendiz });
  } catch (error) {
    console.error('❌ Error al asignar empresa:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.', error });
  }
};