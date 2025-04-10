const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const observacionController = require('../controllers/observacionController');

// ✅ Crear o actualizar observación (por usuario)
router.post('/crear', authMiddleware, observacionController.crearObservacion);

// ✅ Obtener observaciones (según rol y bitácora específica)
router.get('/bitacora/:id', authMiddleware, observacionController.obtenerObservacionesPorBitacora);

// ✅ Modificar observación (solo si eres quien la creó)
router.put('/actualizar/:id', authMiddleware, observacionController.actualizarObservacion);

// ✅ Eliminar observación (solo si eres quien la creó o eres admin)
router.delete('/eliminar/:id', authMiddleware, observacionController.eliminarObservacion);

module.exports = router;