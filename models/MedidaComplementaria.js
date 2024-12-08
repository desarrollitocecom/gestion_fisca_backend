const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MedidaComplementaria = sequelize.define('MedidaComplementaria', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        id_documento: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
             model: 'TipoDocumentoComplementarios',
                key: 'id',
            },
       },
       nro_medida_complementaria: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        documento_medida_complementaria: {
            type: DataTypes.STRING,
            allowNull: true
       },
       id_ejecucionMC: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'EjecucionMCs',
            key: 'id',
        },       
    },
    
       nro_acta_ejecucion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
       
        
        dc_levantamiento: {
            type: DataTypes.STRING,
            allowNull: true
         },
        id_estado: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'EstadoMCs', 
                key: 'id'
            },
        }

    }, {
        tableName: 'MedidaComplementarias',
        timestamps: true
    });

    MedidaComplementaria.associate = (db) => {
        MedidaComplementaria.belongsTo(db.TipoDocumentoComplementario, { foreignKey: 'id_documento', as: 'tipoDocumento' });
        MedidaComplementaria.belongsTo(db.EjecucionMC, { foreignKey: 'id_ejecucionMC', as: 'ejecucion' });
        MedidaComplementaria.belongsTo(db.EstadoMC, { foreignKey: 'id_estado', as: 'estado' });
    };

    return MedidaComplementaria;
};
