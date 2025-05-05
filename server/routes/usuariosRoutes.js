const express = require('express');
const {verUsuarios, verPorId, crearUsuario, modificarUsuario, eliminarUsuario,obtenerUsuarioAutenticado, obtenerInstructores,
    crearAprendiz } = require('../controllers/usuariosController');
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router();

//rutas no protegidas
// router.post('/login',login)


//rutas que estan protegidas por token
router.post('/crear',authMiddleware, crearUsuario);
router.post('/registroAprendiz', crearAprendiz);
router.get('/ver',authMiddleware, verUsuarios);
router.get('/instructores', obtenerInstructores);
router.get('/ver/:id', authMiddleware, verPorId);
router.put('/modificar/:id',authMiddleware, modificarUsuario);
router.patch('/eliminar/:idUsuario',authMiddleware, eliminarUsuario);
router.get("/me", authMiddleware,obtenerUsuarioAutenticado);


module.exports = router;