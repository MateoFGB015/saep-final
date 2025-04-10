const Documento = require('../models/Documento');
const FichaAprendiz = require('../models/FichaAprendiz');
const fs = require('fs');
const path = require('path');

exports.subirDocumento = async (req, res) => {
  try {
    const { id: id_usuario } = req.usuario;
    const { tipo_documento, descripcion } = req.body;

    // Verificar si subieron archivo
    if (!req.file) {
      return res.status(400).json({ mensaje: 'Debes subir un archivo.' });
    }

    const archivo = req.file.filename;

    const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });
    if (!relacion) {
      return res.status(404).json({ mensaje: 'No estás asociado a ninguna ficha.' });
    }

    const documento = await Documento.create({
      tipo_documento,
      descripcion,
      documento: archivo,
      id_ficha_aprendiz: relacion.id_ficha_aprendiz,
      fecha_ultima_actualizacion: new Date()
    });

    res.status(201).json({ mensaje: '✅ Documento subido correctamente.', data: documento });

  } catch (error) {
    console.error('❌ Error al subir documento:', error);
    res.status(500).json({ mensaje: 'Error al subir documento.', error });
  }
};

exports.verDocumentosAprendiz = async (req, res) => {
    try {
      const { id: id_usuario } = req.usuario;
  
      const relacion = await FichaAprendiz.findOne({ where: { id_usuario } });
      if (!relacion) {
        return res.status(404).json({ mensaje: 'No estás asociado a ninguna ficha.' });
      }
  
      const documentos = await Documento.findAll({
        where: { id_ficha_aprendiz: relacion.id_ficha_aprendiz },
        order: [['fecha_ultima_actualizacion', 'DESC']]
      });
  
      res.json(documentos);
  
    } catch (error) {
      console.error('❌ Error al obtener documentos:', error);
      res.status(500).json({ mensaje: 'Error al obtener documentos.', error });
    }
  };

  exports.verDocumentosPorFicha = async (req, res) => {
    try {
      const { id_ficha } = req.params;
  
      const fichasAprendiz = await FichaAprendiz.findAll({ where: { id_ficha } });
      const idsFichaAprendiz = fichasAprendiz.map(f => f.id_ficha_aprendiz);
  
      const documentos = await Documento.findAll({
        where: { id_ficha_aprendiz: idsFichaAprendiz },
        order: [['fecha_ultima_actualizacion', 'DESC']]
      });
  
      res.json(documentos);
  
    } catch (error) {
      console.error('❌ Error al obtener documentos por ficha:', error);
      res.status(500).json({ mensaje: 'Error al obtener documentos por ficha.', error });
    }
  };

  exports.modificarDocumento = async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo_documento, nombre_documento, descripcion } = req.body;
  
      // Buscar el documento existente
      const documentoExistente = await Documento.findByPk(id);
      if (!documentoExistente) {
        return res.status(404).json({ mensaje: 'Documento no encontrado' });
      }
  
      // Verificar si se subió un nuevo archivo
      let nuevoNombreArchivo = documentoExistente.documento;
  
      if (req.file) {
        nuevoNombreArchivo = req.file.filename;
  
        // Eliminar el archivo anterior del servidor
        const rutaAnterior = path.join(__dirname, '..', 'uploads', 'documentos', documentoExistente.documento);
        if (fs.existsSync(rutaAnterior)) {
          fs.unlinkSync(rutaAnterior);
        }
      }
  
      // Actualizar en base de datos
      await Documento.update({
        tipo_documento,
        nombre_documento,
        descripcion,
        documento: nuevoNombreArchivo,
        fecha_ultima_actualizacion: new Date()
      }, {
        where: { id_documento: id }
      });
  
      const documentoActualizado = await Documento.findByPk(id);
      res.json({ mensaje: '✅ Documento actualizado correctamente', data: documentoActualizado });
  
    } catch (error) {
      console.error('❌ Error al modificar documento:', error);
      res.status(500).json({ mensaje: 'Error al modificar el documento', error });
    }
  };

  exports.eliminarDocumento = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Buscar el documento
      const documento = await Documento.findByPk(id);
      if (!documento) {
        return res.status(404).json({ mensaje: 'Documento no encontrado' });
      }
  
      // Eliminar archivo físico si existe
      const rutaArchivo = path.join(__dirname, '..', 'uploads', 'documentos', documento.documento);
      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
      }
  
      // Eliminar de base de datos
      await Documento.destroy({ where: { id_documento: id } });
  
      res.json({ mensaje: '✅ Documento eliminado correctamente' });
  
    } catch (error) {
      console.error('❌ Error al eliminar documento:', error);
      res.status(500).json({ mensaje: 'Error al eliminar el documento', error });
    }
  };
