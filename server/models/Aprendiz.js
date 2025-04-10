const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const modeloAprendiz = sequelize.define("Aprendiz", {
  id_aprendiz: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  alternativa: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  cargo_empresa: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  jefe_inmediato: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
}, {
  tableName: "aprendiz",
  timestamps: false,
});

module.exports = modeloAprendiz;
