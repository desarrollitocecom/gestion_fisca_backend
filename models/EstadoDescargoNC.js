const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const EstadoDescargoNC=sequelize.define('EstadoDescargoNC',{
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
        tableName: 'EstadoDescargoNCs',
        timestamps: true
    });

    return EstadoDescargoNC;
}