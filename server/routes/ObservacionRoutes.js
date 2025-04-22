const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const observacionController = require('../controllers/observacionController');

router.post(
    '/bitacora/:id_bitacora',
    authMiddleware,
    observacionController.crearOActualizarObservacion
  );

router.get(
    '/bitacora/:id_bitacora',
    authMiddleware,
    observacionController.verObservacionesDeBitacora
  );
    
router.delete(
    '/:id',
    authMiddleware,
    observacionController.eliminarObservacion
  );
module.exports = router;