const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Ficha = sequelize.define('Ficha', {
  id_ficha: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero_ficha: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  nombre_programa: { type: DataTypes.STRING, allowNull: false },
  termino_programa: { type: DataTypes.STRING, allowNull: false },
  archivar: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  inicio_etapa_productiva: { type: DataTypes.DATEONLY, allowNull: false },
  fin_etapa_productiva: { type: DataTypes.DATEONLY, allowNull: false },
  id_instructor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
}, {
  tableName: 'ficha',
  timestamps: false
});


module.exports = Ficha;
