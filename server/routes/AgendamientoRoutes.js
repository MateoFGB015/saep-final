const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const agendamientoController = require('../controllers/AgendamientoController');


// Crear agendamiento (instructor autenticado)
router.post('/crear', authMiddleware, agendamientoController.crearAgendamiento);

//Crear agendamiento con administrador
router.post('/crear/:idInstructor', authMiddleware,agendamientoController.crearAgendamientoPorAdmin);

// Obtener agendamientos del instructor logueado
router.get('/instructor', authMiddleware, agendamientoController.obtenerAgendamientosInstructor);

// Modificar un agendamiento (solo si le pertenece al instructor logueado)
router.put('/modificar/:id', authMiddleware, agendamientoController.modificarAgendamiento);

// Eliminar agendamiento (solo si le pertenece al instructor logueado)
router.delete('/eliminar/:id', authMiddleware, agendamientoController.eliminarAgendamiento);

// Obtener fichas (solo activas)
router.get('/fichas', authMiddleware, agendamientoController.obtenerFichas);

// Obtener aprendices por ficha
router.get('/aprendices/:id_ficha', authMiddleware, agendamientoController.obtenerAprendicesPorFicha);

//obtener agendamientos por aprendiz
router.get('/aprendiz', authMiddleware, agendamientoController.obtenerAgendamientosAprendiz);

//obtener agendamientos de un instructor por id
router.get('/instructor/:id', authMiddleware, agendamientoController.obtenerAgendamientosPorInstructor);

//Modificar agendamiento como admin
router.put('/admin/modificar/:id', authMiddleware, agendamientoController.modificarAgendamientoAdmin);

// eliminar un agendamiento como admin
router.delete('/admin/eliminar/:id', authMiddleware, agendamientoController.eliminarAgendamientoAdmin);

module.exports = router;