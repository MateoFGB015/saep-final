const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const modeloUsuario = require('../models/usuario');
const {enviarCorreo} = require('../utils/EmailService');
const frontendUrl = process.env.FRONTEND_URL;
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

//------------------------------------ Endpoint para iniciar sesión---------------------------------------------
const login = async (req, res) => {
    try {
        const { correo_electronico, password } = req.body; // Extraer datos del cuerpo de la solicitud

        if (!correo_electronico || !password) { // Validar que ambos campos estén presentes
            return res.status(400).json({ message: "Correo electrónico y contraseña son requeridos" });
        }

        const usuario = await modeloUsuario.findOne({ where: { correo_electronico } }); // Buscar usuario en la base de datos

        if (!usuario) { // Verificar si el usuario existe
            return res.status(404).json({ message: "Credenciales incorrectas" });
        }

        const isMatch = await bcrypt.compare(password, usuario.password); // Comparar contraseñas
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign( // Generar token JWT
            {
                id: usuario.id_usuario,
                correo_electronico: usuario.correo_electronico,
                rol: usuario.rol
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ // Responder con éxito
            message: "Inicio de sesión exitoso",
            token,
            Usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo_electronico: usuario.correo_electronico,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("Error en el login: ", error);
        res.status(500).json({ message: "Error en el proceso de autenticación" });
    }
};



//----------------------------enviar correo para restablecer la contraseña-----------------------------------
const solicitar = async (req,res) => {
    const { correo_electronico } = req.body;

    if (!correo_electronico) {
        return res.status(400).json({ message: "Correo electrónico requerido" });
    }

    try {
        const usuario = await modeloUsuario.findOne({ where: { correo_electronico } });

        if (!usuario) {
            return res.status(404).json({ message: "Correo electrónico no encontrado" });
        }

        // Generar token con duración de 1 hora
        const token = jwt.sign({ id: usuario.id_usuario }, JWT_SECRET, { expiresIn: '1h' });
        console.log("🔑 Token generado:", token);
    
        const resetLink = `${frontendUrl}/restablecer-contrasenia/${token}`;// este es el url que llega al correo

        // Configurar el correo
        const to = correo_electronico;
        const subject = 'Restablecimiento de Contraseña';
        const text = `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`;
        

        // Enviar correo
        const correoEnviado = await enviarCorreo(to, subject, text);

        if (!correoEnviado) {
            return res.status(500).json({ mensaje: 'Error al enviar el correo de recuperación.', error: correoEnviado.error });
        }

        return res.json({ success: true, message: "Correo enviado exitosamente", token });
        

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ mensaje: 'Error al enviar el correo', error });
    }
};



//restablecer la contraseña
const restablecer = async (req, res) => {
    const { token } = req.params;
    const { nueva_contrasenia } = req.body;

    if (!nueva_contrasenia) {
        return res.status(400).json({ success: false, message: "Nueva contraseña es requerida" });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        const id_usuario = decoded.id;

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(nueva_contrasenia, 10);

        // Actualizar la contraseña en la base de datos usando Sequelize
        const [updated] = await modeloUsuario.update(
            { password: hashedPassword },
            { where: { id_usuario } }
        );

        if (updated) {
            return res.json({ success: true, message: "Contraseña restablecida exitosamente" });
        } else {
            return res.status(400).json({ success: false, message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error en resetPassword:", error);
        return res.status(400).json({ success: false, message: "Token inválido o expirado" });
    }
};

module.exports = {
    login,
    solicitar,
    restablecer
};
