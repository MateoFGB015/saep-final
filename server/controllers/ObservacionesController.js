const Observacion = require('../models/observacion');

exports.crearObservacion = async (req, res) => {
    const { observacion, mostrar_observacion, tipo_objetivo, id_objetivo } = req.body;
    const { id: id_usuario, rol: rol_usuario } = req.usuario;
  
    if (!['Instructor', 'Administrador', 'Aprendiz'].includes(rol_usuario)) {
      return res.status(403).json({ mensaje: 'Rol no autorizado para hacer observaciones.' });
    }
  
    try {
      // Verificar si ya existe una observación del mismo usuario en ese objetivo
      const yaExiste = await Observacion.findOne({
        where: { id_usuario, rol_usuario, tipo_objetivo, id_objetivo }
      });
  
      if (yaExiste) {
        return res.status(400).json({ mensaje: 'Ya existe una observación de este usuario para este objetivo.' });
      }
  
      const nueva = await Observacion.create({
        observacion,
        mostrar_observacion,
        tipo_objetivo,
        id_objetivo,
        id_usuario,
        rol_usuario,
        fecha_ultima_actualizacion: new Date()
      });
  
      res.status(201).json({ mensaje: 'Observación creada con éxito', data: nueva });
    } catch (error) {
      console.error('❌ Error al crear observación:', error);
      res.status(500).json({ mensaje: 'Error al crear observación', error });
    }
  };

exports.obtenerObservaciones = async (req, res) => {
    const { rol, id } = req.usuario;
    const { id_bitacora } = req.params; // viene de la URL: /observaciones/:id_bitacora
  
    try {
      // Si es aprendiz, solo obtiene observaciones de esa bitácora
      if (rol === 'Aprendiz') {
        const observaciones = await Observacion.findAll({
          where: {
            tipo_objetivo: 'bitacora',
            id_objetivo: id_bitacora
          }
        });
  
        return res.json(observaciones);
      }
  
      // Si es instructor o admin, devuelve todas (o podrías filtrar también por bitácora si quieres)
      const observaciones = await Observacion.findAll({
        where: {
          tipo_objetivo: 'bitacora',
          id_objetivo: id_bitacora
        }
      });
  
      return res.json(observaciones);
    } catch (error) {
      console.error('❌ Error al obtener observaciones:', error);
      res.status(500).json({ mensaje: 'Error al obtener observaciones', error });
    }
  };

exports.actualizarObservacion = async (req, res) => {
    const { id } = req.params;
    const { observacion, mostrar_observacion } = req.body;
    const { id: id_usuario, rol: rol_usuario } = req.usuario;
  
    try {
      const obs = await Observacion.findByPk(id);
  
      if (!obs) return res.status(404).json({ mensaje: 'Observación no encontrada.' });
  
      if (obs.id_usuario !== id_usuario || obs.rol_usuario !== rol_usuario) {
        return res.status(403).json({ mensaje: 'No puedes modificar esta observación.' });
      }
  
      await obs.update({
        observacion,
        mostrar_observacion,
        fecha_ultima_actualizacion: new Date()
      });
  
      res.json({ mensaje: 'Observación actualizada', data: obs });
    } catch (error) {
      console.error('❌ Error al actualizar observación:', error);
      res.status(500).json({ mensaje: 'Error al actualizar observación', error });
    }
  };
  
  exports.eliminarObservacion = async (req, res) => {
    const { id } = req.params;
    const { id: id_usuario, rol: rol_usuario } = req.usuario;
  
    try {
      const obs = await Observacion.findByPk(id);
  
      if (!obs) return res.status(404).json({ mensaje: 'Observación no encontrada.' });
  
      if (obs.id_usuario !== id_usuario || obs.rol_usuario !== rol_usuario) {
        return res.status(403).json({ mensaje: 'No puedes eliminar esta observación.' });
      }
  
      await obs.destroy();
      res.json({ mensaje: 'Observación eliminada correctamente' });
    } catch (error) {
      console.error('❌ Error al eliminar observación:', error);
      res.status(500).json({ mensaje: 'Error al eliminar observación', error });
    }
  };
  