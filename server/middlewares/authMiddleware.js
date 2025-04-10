const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔹 Token recibido en el middleware:', token);

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token decodificado:', decoded);

        req.usuario = decoded;  
        next();
    } catch (error) {
        console.error('🔴 Error al verificar el token:', error);
        res.status(401).json({ message: 'Token inválido o expirado', expired: true });
    }
};

module.exports = authMiddleware;
