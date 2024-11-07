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
            primaryKey: true,
        },
        hora: {
            type: DataTypes.TIME,
            primaryKey: true,
        },
        lugar:{
          type:DataTypes.STRING,
          allowNull: false
        }, 
        caracteristicas:{
          type:DataTypes.STRING,
          allowNull: false
        },
        nro_nc:{
            type:DataTypes.STRING,
            allowNull: false
        },
        nombre_test1:{
            type:DataTypes.STRING,
            allowNull: false
        },  
        doc_test1:{
            type:DataTypes.INTEGER,
            allowNull: false
        }, 
        nombre_test2:{
            type:DataTypes.STRING,
            allowNull: false
        },  
        doc_test2:{
            type:DataTypes.INTEGER,
            allowNull: false
        }, 
        puerta:{
            type:DataTypes.STRING,
            allowNull: false
        },
        nro_pisos:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        nro_suministro:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        observaciones:{
            type:DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: 'ConstanciaNotificaciones',
        timestamps: true
    });

    return ConstanciaNotificacion;
}