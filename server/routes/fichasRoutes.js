const express = require('express');
const router = express.Router();
const fichasController = require('../controllers/fichasController');
const verificarToken = require('../middlewares/authMiddleware');

//​‌‌‍⁡⁢⁢⁢‍𝘾͟𝙧͟𝙚͟𝙖͟𝙧 𝙁͟𝙞͟𝙘͟𝙝͟𝙖⁡​
router.post('/', fichasController.crearFicha);

//⁡⁣⁣⁢​‌‌‍𝘝͟𝘦͟𝘳 𝘵͟𝘰͟𝘥͟𝘢͟𝘴 𝘭͟𝘢͟𝘴 𝘧͟𝘪͟𝘤͟𝘩͟𝘢͟𝘴​⁡
router.get('/ver', fichasController.obtenerFichas);

//⁡⁢⁣⁣​‌𝘔͟𝘰͟𝘴͟𝘵͟𝘳͟𝘢͟𝘵 𝘍͟𝘪͟𝘤͟𝘩͟𝘢͟𝘴 𝘥͟𝘦 𝘶͟𝘯 𝘪͟𝘯͟𝘴͟𝘵͟𝘳͟𝘶͟𝘤͟𝘵͟𝘰͟𝘳​⁡
router.get('/instructor', verificarToken, fichasController.obtenerFichasInstructor);


// ⁡⁣⁣⁢​‌‌‍‍‍𝘝͟𝘦͟𝘳 𝘪͟𝘯͟𝘧͟𝘰͟𝘳͟𝘮͟𝘢͟𝘤͟𝘪͟ó͟𝘯 𝘥͟𝘦 𝘶͟𝘯͟𝘢 𝘧͟𝘪͟𝘤͟𝘩͟𝘢 ​⁡
router.get('/ver/:id', fichasController.obtenerInfoFicha);

//⁡⁣⁢⁣​‌‌‍𝘈͟𝘤͟𝘵͟𝘶͟𝘢͟𝘭͟𝘪͟𝘻͟𝘢͟𝘳 𝘍͟𝘪͟𝘤͟𝘩͟𝘢​⁡
router.put('/modificar/:id', fichasController.actualizarFicha);

//⁡⁢⁣⁢​‌‌‍𝘌͟𝘭͟𝘪͟𝘮͟𝘪͟𝘯͟𝘢͟𝘳 𝘍͟𝘪͟𝘤͟𝘩͟𝘢​⁡
router.delete('/eliminar/:id', fichasController.eliminarFicha);

//⁡⁢⁣⁣​‌‌‍𝘈͟𝘳͟𝘤͟𝘩͟𝘪͟𝘷͟𝘢͟𝘳 𝘍͟𝘪͟𝘤͟𝘩͟𝘢​⁡
router.put('/:id/archivar', fichasController.archivarFicha);

module.exports = router;


