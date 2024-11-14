const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TramiteInspector = sequelize.define('TramiteInspector',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_nc:{
          type:DataTypes.STRING,
          allowNull: true
        },
        documento_nc:{
            type:DataTypes.STRING,
            allowNull:true
        },
        nro_acta:{
            type:DataTypes.STRING,
            allowNull:true
        },
        // documento_acta:{
        //     type:DataTypes.STRING,
        //     allowNull:true
        // },
        // nro_opcional:{
        //     type:DataTypes.STRING,
        //     allowNull:true
        // },
        id_medida_complementaria: {
            type: DataTypes.UUID,
            references: {
                model: 'MedidaComplementarias',
                key: 'id',
            },
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
        TramiteInspector.hasMany(db.NC, { foreignKey: 'id_infraccion', as: 'nc'})
        TramiteInspector.belongsTo(db.MedidaComplementaria, { foreignKey: 'id_medida_complementaria', as: 'medidaComplementaria' });
    }

    return TramiteInspector;
};