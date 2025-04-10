const express = require('express');
const router = express.Router();
const FichaAprendiz = require('../controllers/FichaAprendizController');

router.delete('/eliminar_aprendiz',FichaAprendiz.eliminarAprendizDeFicha);


module.exports = router;