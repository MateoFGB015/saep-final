const Agendamiento = require('../models/Agendamiento');

const limitarVisitas = async (req, res, next) => {
  try {
    const idAprendiz = req.user.id; // ID del aprendiz autenticado

    // Contar las visitas activas del aprendiz
    const visitasActivas = await Agendamiento.count({
      where: { id_aprendiz: idAprendiz }
    });

    if (visitasActivas >= 3) {
      return res.status(400).json({ error: "No puedes tener más de 3 visitas activas." });
    }

    next(); // Continúa si tiene menos de 3 visitas
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar el límite de visitas." });
  }
};

module.exports = limitarVisitas;