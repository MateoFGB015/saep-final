const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const FichaAprendiz = require('../controllers/FichaAprendizController');

// Ruta para obtener un aprendiz de una ficha
router.delete('/eliminar_aprendiz/:id_ficha/:id_usuario', FichaAprendiz.eliminarAprendizDeFicha);

// Crear empresa → acceso para todos los roles autenticados
router.post('/crear_empresa', authMiddleware, FichaAprendiz.crearEmpresa);

// Obtener todas las empresas → acceso para todos los roles autenticados
router.get('/obtener_empresas', authMiddleware, FichaAprendiz.obtenerEmpresas);

// Obtener la empresa del aprendiz → acceso para todos los roles autenticados
router.get('/obtener_empresa_aprendiz/:idAprendiz?', authMiddleware, FichaAprendiz.obtenerEmpresaDelAprendiz);

router.put('/asignar_empresa/:idAprendiz?', authMiddleware, FichaAprendiz.asignarEmpresaAUnAprendiz);

module.exports = router;