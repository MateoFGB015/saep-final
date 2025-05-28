const express = require('express');
const router = express.Router();
const { createNotificacion } = require('../controllers/notificacion/createNotificacion');
const { obtenerNotificacionesPorUsuario } = require('../controllers/notificacion/obtenerNotificaciones');
const { updateNotificacionState } = require('../controllers/notificacion/updateNotificacionState');
const { solicitarVisita } = require('../controllers/notificacion/solicitarVisita');
const authMiddleware = require('../middlewares/authMiddleware');

// POST   /api/notificaciones         → crea una notificación
router.post('/', createNotificacion);

// GET    /api/notificaciones/:idUsuario/usuario  
//         → devuelve todas las notificaciones del usuario
router.get('/:idUsuario/usuario', authMiddleware, obtenerNotificacionesPorUsuario);

// PATCH  /api/notificaciones/:idNotificacion/estado  
//         → actualiza el estado (leído/archivado, etc.)
router.patch('/:idNotificacion/estado', authMiddleware, updateNotificacionState);

router.post('/solicitarVisita', authMiddleware, solicitarVisita);

module.exports = router;
