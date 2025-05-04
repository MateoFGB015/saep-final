const { Op } = require('sequelize');
const Usuario = require('../models/usuario');
const Aprendiz = require('../models/Aprendiz');
const Empresa = require('../models/Empresa');
const FichaAprendiz = require('../models/FichaAprendiz');
const Ficha = require('../models/fichas');
const Documento = require('../models/Documento');
const Bitacora = require('../models/Bitacora');
const Agendamiento = require('../models/Agendamiento');

exports.reporteAprendiz = async (req, res) => {
    try {
      const { id } = req.params; // 👈 aquí estaba el error
      const aprendiz = await Usuario.findOne({
        where: {
          id_usuario: id,
          rol: 'aprendiz'
        },
        attributes: ['id_usuario', 'nombre', 'apellido', 'numero_documento', 'correo_electronico', 'telefono', 'tipo_documento'],
        include: [
          {
            model: Aprendiz,
            as: 'detalle_aprendiz',
            attributes: ['jefe_inmediato'],
            include: [
              {
                model: Empresa,
                as: 'empresa',
                attributes: ['razon_social', 'correo_electronico', 'telefono']
              }
            ]
          },
          {
            model: FichaAprendiz,
            as: 'fichasAprendiz',
            attributes: ['id_ficha_aprendiz', 'id_usuario', 'id_ficha'],
            include: [
              {
                model: Ficha,
                as: 'ficha',
                attributes: ['numero_ficha', 'inicio_etapa_productiva', 'fin_etapa_productiva', 'nombre_programa', 'termino_programa']
              },
              {
                model: Documento,
                as: 'documentos',
                attributes: ['id_documento', 'nombre_documento', 'estado_documento', 'descripcion']
              },
              {
                model: Bitacora,
                as: 'bitacoras',
                attributes: ['id_bitacora', 'numero_bitacora', 'estado_bitacora']
              },
              {
                model: Agendamiento,
                as: 'agendamientos',
                attributes: ['id_agendamiento', 'fecha_inicio', 'estado_visita', 'numero_visita']
              }
            ]
          }
        ]
      });
  
      res.json(aprendiz);
    } catch (error) {
      console.error('❌ Error al generar el reporte completo:', error);
      res.status(500).json({
        mensaje: 'Error interno al generar el reporte.',
        error
      });
    }
  };
  

  exports.reporteFicha = async (req, res) => {
    const { id_ficha } = req.params;
    const { rol } = req.usuario;
  
    try {
      const rolUsuario = rol.toLowerCase();
  
      if (rolUsuario !== 'administrador' && rolUsuario !== 'instructor') {
        return res.status(403).json({ mensaje: 'No tienes permisos para generar este reporte.' });
      }
  
      const ficha = await Ficha.findOne({
        where: { id_ficha },
        attributes: ['numero_ficha', 'nombre_programa', 'termino_programa', 'inicio_etapa_productiva', 'fin_etapa_productiva'],
        include: [
          {
            model: FichaAprendiz,
            as: 'fichasAprendiz',
            include: [
              {
                model: Usuario,
                as: 'aprendiz',
                attributes: ['nombre', 'apellido', 'numero_documento']
              }
            ]
          }
        ]
      });
  
      if (!ficha) return res.status(404).json({ mensaje: 'Ficha no encontrada' });
  
      res.json(ficha);
  
    } catch (error) {
      console.error('❌ Error al generar el reporte de ficha:', error);
      res.status(500).json({ mensaje: 'Error interno al generar el reporte de ficha.', error });
    }
  };

  exports.reporteAgendamientos = async (req, res) => {
    try {
      const { rol, id: id_usuario } = req.usuario;
      const { id_instructor } = req.params; // solo si es admin
      const { fechaInicio, fechaFin } = req.query;
  
      // Validar fechas
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ mensaje: 'Debes proporcionar fechaInicio y fechaFin en los query params.' });
      }
  
      // Determinar el ID del instructor según el rol
      let idInstructorConsulta;
      if (rol.toLowerCase() === 'instructor') {
        idInstructorConsulta = id_usuario;
      } else if (rol.toLowerCase() === 'administrador') {
        if (!id_instructor) {
          return res.status(400).json({ mensaje: 'Debes proporcionar el id_instructor en los params.' });
        }
        idInstructorConsulta = id_instructor;
      } else {
        return res.status(403).json({ mensaje: 'No tienes permisos para generar este reporte.' });
      }
  
      const agendamientos = await Agendamiento.findAll({
        where: {
          id_instructor: idInstructorConsulta,
          fecha_inicio: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        include: [
          {
            model: FichaAprendiz,
            as: 'ficha_aprendiz',
            include: [
              {
                model: Usuario,
                as: 'aprendiz',
                include: [
                  {
                    model: Aprendiz,
                    as: 'detalle_aprendiz'
                  }
                ]
              }
            ]
          }
        ]
      });
  
      const resultado = agendamientos.map(ag => ({
        numero_visita: ag.numero_visita,
        fecha_inicio: ag.fecha_inicio,
        estado_visita: ag.estado_visita,
        nombre: ag.ficha_aprendiz?.aprendiz?.nombre || '',
        apellido: ag.ficha_aprendiz?.aprendiz?.apellido || '',
        documento: ag.ficha_aprendiz?.aprendiz?.numero_documento || ''
      }));
  
      res.json(resultado);
    } catch (error) {
      console.error('❌ Error al generar el reporte de agendamientos:', error);
      res.status(500).json({ mensaje: 'Error al generar el reporte de agendamientos', error });
    }
  };
  