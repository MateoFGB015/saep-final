const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerDocumento');
const documentoController = require('../controllers/DocumentoController');

// Subir documento
router.post('/subir', authMiddleware, upload.single('documento'), documentoController.subirDocumento);

// Ver documentos (según rol y ficha)
router.get('/ver', authMiddleware, documentoController.verDocumentos);

// Modificar documento
router.put('/modificar/:id', authMiddleware, upload.single('documento'), documentoController.modificarDocumento);

// Eliminar documento
router.delete('/eliminar/:id', authMiddleware, documentoController.eliminarDocumento);

module.exports = router;
