const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/ReportesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta protegida solo para administradores e instructores
router.get('/aprendiz/:id', authMiddleware, reportesController.reporteAprendiz);
router.get('/ficha/:id_ficha', authMiddleware, reportesController.reporteFicha);
router.get('/agendamientos/:id_instructor?', authMiddleware, reportesController.reporteAgendamientos);


module.exports = router;