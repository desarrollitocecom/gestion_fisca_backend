const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const EstadoNC=sequelize.define('EstadoNC',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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