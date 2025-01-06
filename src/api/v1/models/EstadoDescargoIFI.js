const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const EstadoDescargoIFI=sequelize.define('EstadoDescargoIFI',{
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
        tableName: 'EstadoDescargoIFIs',
        timestamps: true
    });

    return EstadoDescargoIFI;
}