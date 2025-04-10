const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const modeloEmpresa = sequelize.define("Empresa", {
  id_empresa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nit: {
    type: DataTypes.STRING(18),
    allowNull: false,
  },
  razon_social: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  correo_electronico: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  direccion: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
}, {
  tableName: "empresa",
  timestamps: false,
});

module.exports = modeloEmpresa;
