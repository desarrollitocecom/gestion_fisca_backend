const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const EstadoDescargoNC=sequelize.define('EstadoDescargoNC',{
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
        tableName: 'EstadoDescargoNCs',
        timestamps: true
    });

    return EstadoDescargoNC;
}