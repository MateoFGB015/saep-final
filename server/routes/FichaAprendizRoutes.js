const express = require('express');
const router = express.Router();
const FichaAprendiz = require('../controllers/FichaAprendizController');
router.delete('/eliminar_aprendiz/:id_ficha/:id_usuario', FichaAprendiz.eliminarAprendizDeFicha);


module.exports = router;