const FichaAprendiz = require('../models/FichaAprendiz');
const Ficha = require('../models/fichas');
const Usuario = require('../models/usuario');
const Agendamiento = require('../models/Agendamiento');


// Elimina la relación entre un aprendiz y una ficha
exports.eliminarAprendizDeFicha = async (req, res) => {
  const { id_ficha, id_usuario } = req.params;

  try {
    const fichaAprendiz = await FichaAprendiz.findOne({
      where: { id_ficha, id_usuario },
    });

    if (!fichaAprendiz) {
      return res.status(404).json({ mensaje: 'Aprendiz no encontrado en la ficha' });
    }

    // Eliminar agendamientos relacionados
    await Agendamiento.destroy({
      where: { id_ficha_aprendiz: fichaAprendiz.id_ficha_aprendiz },
    });

    // Ahora sí, eliminar la relación ficha-aprendiz
    await fichaAprendiz.destroy();

    res.status(200).json({ mensaje: 'Aprendiz eliminado de la ficha correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar aprendiz de ficha:', error);
    res.status(500).json({ mensaje: 'Error al eliminar aprendiz de ficha' });
  }
};

  
  exports.obtenerAprendizDeFicha = async (req, res) => {
    const { id_ficha, id_usuario } = req.params;
  
    try {
      const relacion = await FichaAprendiz.findOne({
        where: { id_ficha, id_usuario },
        include: {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'apellido', 'correo_electronico', 'telefono']
        }
      });
  
      if (!relacion) {
        return res.status(404).json({ mensaje: "No se encontró esta relación ficha-aprendiz" });
      }
  
      res.status(200).json({ aprendiz: relacion.usuario });
    } catch (error) {
      console.error("❌ Error al obtener aprendiz:", error);
      res.status(500).json({ mensaje: "Error del servidor al buscar aprendiz" });
    }
  };
  

