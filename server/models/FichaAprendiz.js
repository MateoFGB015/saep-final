// models/FichaAprendiz.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FichaAprendiz = sequelize.define('FichaAprendiz', {
  id_ficha_aprendiz: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_ficha: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ficha_aprendiz',
  timestamps: false
});

module.exports = FichaAprendiz;
