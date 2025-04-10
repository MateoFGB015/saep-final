const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definir el modelo de Agendamiento
const modeloAgendamiento = sequelize.define('Agendamiento', {
    id_agendamiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    herramienta_reunion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    enlace_reunion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado_visita: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_visita: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numero_visita: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Agendamiento'
});

module.exports = modeloAgendamiento;