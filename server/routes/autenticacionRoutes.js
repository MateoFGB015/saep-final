const express = require('express');
const { login, solicitar,restablecer } = require('../controllers/autenticacionController');
const router = express.Router();

router.post('/login', login);
router.post('/solicitar-restablecimiento', solicitar);
router.post('/restablecer-contrasenia/:token',restablecer)

module.exports = router;
