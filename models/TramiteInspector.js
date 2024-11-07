const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const TramiteInspector=sequelize.define('TramiteInspector',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_nc:{
          type:DataTypes.STRING,
          allowNull: false
        },
        documento_nc:{
            type:DataTypes.STRING,
            allowNull:false
        },
        nro_acta:{
            type:DataTypes.STRING,
            allowNull:false
        },
        documento_acta:{
            type:DataTypes.STRING,
            allowNull:false
        },
        nro_opcional:{
            type:DataTypes.STRING,
            allowNull:false
        },
        documento_opcional:{
            type:DataTypes.STRING,
            allowNull:false
        },

    }, {
        tableName: 'TramiteInspectores',
        timestamps: true
    });

    // // Relación: Un InspectorDocumento tiene muchos NC
    // inspectorDocumento.hasMany(sequelize.models.NC, {
    //     foreignKey: 'id_inspectorDocumento',  // FK en NC que hace referencia a InspectorDocumento
    //     as: 'ncs',  // Alias para acceder a los NC relacionados
    // });
    

    return TramiteInspector;
};