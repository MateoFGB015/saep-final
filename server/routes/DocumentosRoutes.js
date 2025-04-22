const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('../middlewares/multerDocumento');
const documentoController = require('../controllers/DocumentoController');

 router.post(
    '/subir',
    authMiddleware,
    multer.single('documento'), 
    documentoController.subirDocumento
  );

  //subir documentos admin a un aprendiz seleccionado

  router.post(
    '/subir/admin/:id_aprendiz',
    authMiddleware,
    multer.single('documento'),
    documentoController.subirDocumentoComoAdmin
  );

  router.get(
    '/ver/:id_aprendiz?',
    authMiddleware,
    documentoController.verDocumentos
  );

  router.put(
    '/modificar/:id',
    authMiddleware,
    multer.single('documento'),
    documentoController.modificarDocumento
  );

  router.delete(
    '/eliminar/:id',
    authMiddleware,
    documentoController.eliminarDocumento
  );
module.exports = router;
