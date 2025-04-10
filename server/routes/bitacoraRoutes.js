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

  router.get(
    '/mis_bitacoras',
    authMiddleware,
    bitacoraController.verBitacorasSubidas);

module.exports = router;