const express = require('express');
const agendamientoController = require('../controllers/AgendamientoController');


const router = express.Router();

router.get('/ver', agendamientoController.obtenerAgendamientos);
router.get('/ver-fichas', agendamientoController.obtenerFichas);//esto es para que muestre las fichas que existen en el select
router.get('/ver-aprendiz/:id_ficha', agendamientoController.obtenerAprendicesPorFicha); //muestra en un sleect los aprendices que hay en la ficha que seleccionamos antes
router.get('/ver/:id', agendamientoController.obtenerAgendamientoPorId);
router.post('/crear', agendamientoController.crearAgendamiento);
router.put('/modificar/:id', agendamientoController.modificarAgendamiento);
router.delete('/eliminar/:id', agendamientoController.eliminarAgendamiento);

module.exports = router;