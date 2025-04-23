const bcrypt = require('bcryptjs');
const modeloUsuario = require('../models/usuario');
const { Op } = require('sequelize');



// Crear usuario
const crearUsuario = async (req, res) => {
    try {
        const { tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, password } = req.body;
        const firma = req.file ? req.file.filename : null;

        const existeCorreo = await modeloUsuario.findOne({ where: { correo_electronico } });
        if (existeCorreo) return res.status(400).json({ message: 'El correo ya está registrado' });

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await modeloUsuario.create({
            tipo_documento, numero_documento, nombre, apellido, telefono,
            correo_electronico, firma, rol, password: passwordHash, estado_usuario: 1
        });

        res.status(201).json({ message: 'Usuario creado', data: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};

// Ver usuarios
const verUsuarios = async (req, res) => {
    try {
        const usuarios = await modeloUsuario.findAll({ where: { estado_usuario: 1 } });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

// Ver usuario por ID
const verPorId = async (req, res) => {
    try {
        const usuario = await modeloUsuario.findByPk(req.params.id, {
            attributes: [
                'id_usuario',
                'tipo_documento',
                'numero_documento',
                'nombre',
                'apellido',
                'telefono',
                'correo_electronico',
                'firma',
                'rol',
                'estado_usuario'
            ]
        });

        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar usuario', error: error.message });
    }
};

// ver instructores
const obtenerInstructores = async (req, res) => {
    try {
      const instructores = await modeloUsuario.findAll({
        where: { rol: "Instructor", estado_usuario: 1 },
        attributes: ["id_usuario", "nombre", "apellido"]
      });
  
      res.json(instructores);
    } catch (error) {
      console.error("Error al obtener instructores:", error);
      res.status(500).json({ mensaje: "Error al obtener instructores", error });
    }
  };
// Modificar usuario
const modificarUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del usuario desde la URL
        const { password, correo_electronico, ...otrosCampos } = req.body;

        console.log("ID recibido:", id);
        console.log("Datos recibidos:", req.body);

        if (!id) {
            return res.status(400).json({ message: "El ID del usuario es obligatorio." });
        }

        // Buscar usuario
        const usuario = await modeloUsuario.findByPk(id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        console.log("Usuario encontrado:", usuario.toJSON());

        // Validar si el correo ya existe en otro usuario
        if (correo_electronico && correo_electronico !== usuario.correo_electronico) {
            const existeCorreo = await modeloUsuario.findOne({
                where: { correo_electronico, id_usuario: { [Op.ne]: id } }
            });

            if (existeCorreo) {
                return res.status(400).json({ message: 'Correo ya en uso por otro usuario' });
            }
        }

        // Si envía una nueva contraseña, encriptarla
        if (password) {
            otrosCampos.password = await bcrypt.hash(password, 10);
        }

        // Actualizar solo los campos enviados
        await usuario.update({ correo_electronico, ...otrosCampos });

        res.json({ message: 'Usuario actualizado correctamente' });

    } catch (error) {
        console.error("Error en modificarUsuario:", error);
        res.status(500).json({ message: 'Error al modificar usuario', error: error.message });
    }
};



// Eliminar (desactivar) usuario
const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await modeloUsuario.findByPk(req.params.idUsuario);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (usuario.estado_usuario === 0) {
            return res.status(400).json({ message: 'El usuario ya está inactivo' });
        }

        await usuario.update({ estado_usuario: 0 });
        res.json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar usuario', error: error.message });
    }
};


const obtenerUsuarioAutenticado = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        // Buscar usuario en la base de datos
        const usuario = await modeloUsuario.findByPk(usuarioId, {
            attributes: { exclude: ['password'] }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error("Error obteniendo usuario autenticado:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};



module.exports = { crearUsuario,verUsuarios, verPorId, modificarUsuario, obtenerInstructores, eliminarUsuario,obtenerUsuarioAutenticado };