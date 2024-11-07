const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const DescargoNC=sequelize.define('DescargoNC',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_descargo:{
          type:DataTypes.STRING,
          allowNull: false
        },
        // id_estado:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'EstadoDescargoNC',
        //         key: 'id',
        //     },
        //     allowNull: false
        // },
        // id_usuario:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Usuario',
        //         key: 'id',
        //     },
        //     allowNull: false
        // },
        fecha_descargo:{
          type:DataTypes.DATE,
          allowNull: false
        },
        documento:{
            type:DataTypes.STRING,
            allowNull: false
        },      
    }, {
        tableName: 'DescargoNCs',
        timestamps: true
    });

    return DescargoNC;
}