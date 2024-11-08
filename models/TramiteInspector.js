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
            allowNull:true
        },
        acta_opcional:{
            type:DataTypes.STRING,
            allowNull:true
        },

    }, {
        tableName: 'TramiteInspectores',
        timestamps: true
    });

    TramiteInspector.associate = (db) => {
        TramiteInspector.hasMany(db.NC, { foreignKey: 'id_tramiteInspector', as: 'nc'})
    }

    return TramiteInspector;
};