const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const modeloUsuario = sequelize.define('Usuario', {
    id_usuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo_documento: { type: DataTypes.STRING },
    numero_documento: { type: DataTypes.STRING,unique: true },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    correo_electronico: { type: DataTypes.STRING, unique: true },
    rol: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    estado_usuario: { type: DataTypes.INTEGER, defaultValue: 1 } // 1 activo, 0 inactivo
}, {
    tableName: 'usuario',
    timestamps: false
});

module.exports = modeloUsuario;