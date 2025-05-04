const fs = require('fs');
const path = require('path');
const Documento = require('../models/Documento');
const Usuario = require('../models/usuario');
const FichaAprendiz = require('../models/FichaAprendiz');

exports.subirDocumento = async (req, res) => {
  try {
    console.log('=== SOLICITUD DE SUBIDA DE DOCUMENTO ===');
    console.log('Usuario:', req.usuario);
    console.log('Archivo recibido:', req.file);
    console.log('Body:', req.body);

    const { id: id_usuario, rol } = req.usuario;

    if (rol !== 'aprendiz') {
      console.log('Error: Rol no permitido -', rol);
      return res.status(403).json({ mensaje: 'Solo los aprendices pueden subir documentos.' });
    }

    if (!req.file) {
      console.log('Error: No se recibió archivo');
      return res.status(400).json({ mensaje: 'Debes subir un archivo.' });
    }

    // Buscar la relación ficha-aprendiz
    const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });
    if (!relacion) {
      return res.status(404).json({ mensaje: 'No se encontró una ficha asociada a tu usuario.' });
    }

    // Crear el documento
    const nuevoDocumento = await Documento.create({
      id_ficha_aprendiz: relacion.id_ficha_aprendiz,
      tipo_documento: req.body.tipo_documento || 'Documento de certificación',
      nombre_documento: req.body.nombre_documento || req.file.originalname,
      descripcion: req.body.descripcion || 'Documento subido por el aprendiz',
      documento: req.file.filename,
      estado_documento: 1,
      fecha_ultima_actualizacion: new Date()
    });

    res.status(201).json({
      mensaje: '✅ Documento subido exitosamente.',
      data: nuevoDocumento
    });

  } catch (error) {
    console.error('❌ Error detallado al subir documento:', error);
    res.status(500).json({
      mensaje: 'Error al subir el documento.',
      error: error.message,
      stack: error.stack
    });
  }
};

exports.verDocumentos = async (req, res) => {
  try {
    const { rol, id: id_usuario } = req.usuario;
    const { id_usuario: id_aprendiz_param } = req.params;

    // Si es aprendiz: solo ve sus propios documentos
    if (rol === 'aprendiz') {
      const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });

      if (!relacion) {
        return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz.' });
      }

      const documentos = await Documento.findAll({
        where: { id_ficha_aprendiz: relacion.id_ficha_aprendiz },
        order: [['fecha_ultima_actualizacion', 'DESC']]
      });

      return res.status(200).json({ documentos });
    }

    // Si es instructor o administrador: se necesita ID del aprendiz
    if ((rol === 'Instructor' || rol === 'Administrador') && id_aprendiz_param) {
      const relacion = await FichaAprendiz.findOne({ where: { id_usuario: id_aprendiz_param } });

      if (!relacion) {
        return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz.' });
      }

      const documentos = await Documento.findAll({
        where: { id_ficha_aprendiz: relacion.id_ficha_aprendiz },
        order: [['fecha_ultima_actualizacion', 'DESC']]
      });

      return res.status(200).json({ documentos });
    }

    // ❌ Si no se envió el ID del aprendiz
    return res.status(400).json({ mensaje: 'Debes proporcionar el ID del aprendiz.' });

  } catch (error) {
    console.error('❌ Error al obtener documentos:', error);
    res.status(500).json({ mensaje: 'Error del servidor al obtener los documentos.', error });
  }
};


exports.subirDocumentoComoAdmin = async (req, res) => {
  try {
    const { id: id_admin, rol } = req.usuario;
    const { id_aprendiz } = req.params;
    const { tipo_documento, nombre_documento, descripcion } = req.body;

    if (rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Solo el administrador puede subir documentos a otros usuarios.' });
    }

    if (!req.file) {
      return res.status(400).json({ mensaje: 'Debes subir un archivo.' });
    }

    const relacion = await FichaAprendiz.findOne({ where: { id_usuario: id_aprendiz } });
    if (!relacion) {
      return res.status(404).json({ mensaje: 'No se encontró una ficha asociada al aprendiz indicado.' });
    }

    const nuevoDocumento = await Documento.create({
      id_ficha_aprendiz: relacion.id_ficha_aprendiz,
      tipo_documento,
      nombre_documento,
      descripcion,
      documento: req.file.filename,
      estado_documento: 1,
      fecha_ultima_actualizacion: new Date()
    });

    res.status(201).json({ mensaje: '✅ Documento subido exitosamente por el administrador.', data: nuevoDocumento });

  } catch (error) {
    console.error('❌ Error al subir documento como admin:', error);
    res.status(500).json({ mensaje: 'Error del servidor al subir el documento.', error });
  }
};

exports.modificarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: id_usuario, rol } = req.usuario;
    const { tipo_documento, nombre_documento, descripcion } = req.body;

    // Buscar el documento
    const documento = await Documento.findByPk(id);
    if (!documento) {
      return res.status(404).json({ mensaje: 'Documento no encontrado.' });
    }

    // Verificar dueño del documento
    const relacion = await FichaAprendiz.findByPk(documento.id_ficha_aprendiz);
    if (!relacion) {
      return res.status(404).json({ mensaje: 'Relación ficha-aprendiz no encontrada.' });
    }

    const esDueño = rol === 'aprendiz' && relacion.id_usuario === id_usuario;
    const esAdmin = rol === 'Administrador';

    if (!esDueño && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tienes permisos para modificar este documento.' });
    }

    // Reemplazar archivo si se sube uno nuevo
    if (req.file) {
      const rutaAnterior = path.join(__dirname, '../uploads/documentos', documento.documento);
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }
      documento.documento = req.file.filename;
    }

    // Actualizar campos si vienen en el body
    documento.tipo_documento = tipo_documento || documento.tipo_documento;
    documento.nombre_documento = nombre_documento || documento.nombre_documento;
    documento.descripcion = descripcion || documento.descripcion;
    documento.fecha_ultima_actualizacion = new Date();

    await documento.save();

    res.status(200).json({ mensaje: '✅ Documento modificado correctamente.', data: documento });

  } catch (error) {
    console.error('❌ Error al modificar documento:', error);
    res.status(500).json({ mensaje: 'Error del servidor al modificar el documento.', error });
  }
};

exports.eliminarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.usuario;

    // Validar permisos
    if (rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Solo el administrador puede eliminar documentos.' });
    }

    // Buscar documento
    const documento = await Documento.findByPk(id);
    if (!documento) {
      return res.status(404).json({ mensaje: 'Documento no encontrado.' });
    }

    // Eliminar archivo del servidor
    const rutaArchivo = path.join(__dirname, '../uploads/documentos', documento.documento);
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    // Eliminar registro de la base de datos
    await documento.destroy();

    res.status(200).json({ mensaje: '✅ Documento eliminado correctamente.' });

  } catch (error) {
    console.error('❌ Error al eliminar documento:', error);
    res.status(500).json({ mensaje: 'Error del servidor al eliminar el documento.', error });
  }
};
