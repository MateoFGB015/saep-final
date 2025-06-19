const express = require('express');
const router = express.Router();
const getNotificaciones = require('../controllers/notificacion/verNotificaciones');
const { solicitarVisita } = require('../controllers/notificacion/solicitarVisita');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/ver', authMiddleware, getNotificaciones);

router.post('/solicitarVisita', authMiddleware, solicitarVisita);

module.exports = router;
