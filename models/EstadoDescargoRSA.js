const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const EstadoDescargoRSA=sequelize.define('EstadoDescargoRSA',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo:{
          type:DataTypes.STRING,
          allowNull: false
        },    
    }, {
        tableName: 'EstadoDescargoRSAs',
        timestamps: true
    });

    return EstadoDescargoRSA;
}