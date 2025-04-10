const {Datatypes}= require('sequelize');
const sequelize = require ('../config/db');

//Definir modelo de Reportes
const Reporte = sequelize.define('Reporte',{
    id_reporte:{
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_reporte:{
        type: Datatypes.STRING(40),
        allowNull: false
    },
    fecha_ultima_actualizacion:{
        type: Datatypes.DATE,
        allowNull: false
    },
    tipo_reporte:{
        type: Datatypes.STRING(30),
        allowNull: false
    },
    id_ficha_aprendiz:{
        type: Datatypes.INTEGER,
        allowNull: false
    },
    
},{
    timestamps:false,
    tableName:'reporte'
});

module.exports = Reporte;