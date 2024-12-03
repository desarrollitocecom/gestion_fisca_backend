const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const EstadoRG=sequelize.define('EstadoRG',{
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
        tableName: 'EstadoRGs',
        timestamps: true
    });

    return EstadoRG;
}