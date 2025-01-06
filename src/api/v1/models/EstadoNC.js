const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const EstadoNC=sequelize.define('EstadoNC',{
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
        tableName: 'EstadoNCs',
        timestamps: true
    });

    return EstadoNC;
}