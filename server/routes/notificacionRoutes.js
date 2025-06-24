const express = require('express');
const router = express.Router();
const verNotificaciones = require('../controllers/notificacion/verNotificaciones');
const { solicitarVisita, marcarNotificacionLeida } = require('../controllers/notificacion/solicitarVisita');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/ver', authMiddleware, verNotificaciones);

router.post('/solicitarVisita', authMiddleware, solicitarVisita);

router.put('/marcarLeida/:id', authMiddleware, marcarNotificacionLeida);

module.exports = router;
