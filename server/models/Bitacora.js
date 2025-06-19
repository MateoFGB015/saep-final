const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const modeloBitacora = sequelize.define('Bitacora', {
    id_bitacora: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    numero_bitacora: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false

    },
    observacion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Sin observaciones'
    },
    bitacora: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado_bitacora:{
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    fecha_ultima_actualizacion:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    id_ficha_aprendiz:{ 
        type:DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    timestamps: false,
    tableName: 'bitacora'
});

module.exports = modeloBitacora;