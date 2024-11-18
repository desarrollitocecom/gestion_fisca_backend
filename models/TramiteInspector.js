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
        documento_acta:{
            type:DataTypes.STRING,
            allowNull:true
        },
        id_medida_complementaria: {
            type: DataTypes.UUID,
            references: {
                model: 'MedidaComplementarias',
                key: 'id',
            },
            allowNull:true
        },
        id_inspector: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull:true
        },
    }, {
        tableName: 'TramiteInspectores',
        timestamps: true
    });

    TramiteInspector.associate = (db) => {
        TramiteInspector.hasMany(db.NC, { foreignKey: 'id_tramiteInspector', as: 'nc'})
        TramiteInspector.belongsTo(db.MedidaComplementaria, { foreignKey: 'id_medida_complementaria', as: 'medidaComplementaria' });
    }

    return TramiteInspector;
};