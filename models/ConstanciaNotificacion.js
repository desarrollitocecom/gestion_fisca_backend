const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const ConstanciaNotificacion=sequelize.define('ConstanciaNotificacion',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: true
        },
        hora: {
            type: DataTypes.TIME,
            allowNull: true
        },
        lugar:{
          type:DataTypes.STRING,
          allowNull: true
        }, 
        caracteristicas:{
          type:DataTypes.STRING,
          allowNull: true
        },
        nro_nc:{
            type:DataTypes.STRING,
            allowNull: true
        },
        nombre_test1:{
            type:DataTypes.STRING,
            allowNull: true
        },  
        doc_test1:{
            type:DataTypes.INTEGER,
            allowNull: true
        }, 
        nombre_test2:{
            type:DataTypes.STRING,
            allowNull: true
        },  
        doc_test2:{
            type:DataTypes.INTEGER,
            allowNull: true
        }, 
        puerta:{
            type:DataTypes.STRING,
            allowNull: true
        },
        nro_pisos:{
            type:DataTypes.INTEGER,
            allowNull: true
        },
        nro_suministro:{
            type:DataTypes.INTEGER,
            allowNull: true
        },
        observaciones_cn:{
            type:DataTypes.STRING,
            allowNull: true
        },
    }, {
        tableName: 'ConstanciaNotificaciones',
        timestamps: true
    });

    return ConstanciaNotificacion;
}