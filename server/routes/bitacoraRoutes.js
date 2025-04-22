const express = require('express');
const multer = require('../middlewares/multerBitacora'); 
const authMiddleware = require('../middlewares/authMiddleware');
const bitacoraController = require('../controllers/bitacoraController');

const router = express.Router();

router.post(
    '/subir',
    authMiddleware, 
    multer.single('bitacora'), 
    bitacoraController.subirBitacora);

// Para aprendiz (sin parámetro) o admin/instructor (con parámetro)
router.get(
  '/ver_bitacoras/:id_usuario_aprendiz?', // ← el parámetro es opcional (solo lo usa admin/instructor)
  authMiddleware,
  bitacoraController.verBitacorasSubidas
);

router.put(
  '/modificar/:id',
  authMiddleware,
  multer.single('bitacora'), // Si se reemplaza archivo
  bitacoraController.modificarBitacora
);

router.delete(
  '/eliminar/:id',
  authMiddleware,
  bitacoraController.eliminarBitacora
);



module.exports = router;