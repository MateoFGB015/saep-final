const {DataTypes}=require('sequelize');
const sequelize =require('../config/db');

    const Documento = sequelize.define('Documento', {
      id_documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_ficha_aprendiz: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tipo_documento: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      nombre_documento: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      estado_documento: {
        type: DataTypes.TINYINT,
        defaultValue: 1
      },
      descripcion: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      fecha_ultima_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      documento: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'documento',
      timestamps: false
    });

    module.exports = Documento;