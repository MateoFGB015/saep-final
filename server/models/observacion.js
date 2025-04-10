const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Observacion = sequelize.define('Observacion', {
  id_observacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mostrar_observacion: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  fecha_ultima_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_usuario: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  rol_usuario: {
    type: DataTypes.ENUM('Administrador', 'Instructor', 'Aprendiz'),
    allowNull: false
  },
  tipo_objetivo: {
    type: DataTypes.ENUM('bitacora'),
    allowNull: false
  },
  id_objetivo: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'observacion',
  timestamps: false
});

module.exports = Observacion;
