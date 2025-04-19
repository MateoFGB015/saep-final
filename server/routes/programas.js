const express = require('express');
const router = express.Router();
 // ajusta si usas otro nombre para la conexión

// Buscar programa por nombre
router.get('/buscar', async (req, res) => {
  const { nombre } = req.query;
  try {
    const [result] = await db.query(
      'SELECT id_programa FROM programas WHERE nombre_programa = ?',
      [nombre]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error al buscar el programa:', error);
    res.status(500).json({ error: 'Error al buscar el programa' });
  }
});

module.exports = router;
