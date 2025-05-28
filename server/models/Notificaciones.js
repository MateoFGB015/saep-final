const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mensaje: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_usuario: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  tableName: 'notificacion',
  timestamps: false
});

module.exports = Notificacion;
