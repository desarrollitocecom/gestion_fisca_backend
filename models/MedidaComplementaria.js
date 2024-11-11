const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MedidaComplementaria = sequelize.define('MedidaComplementaria', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        nro_acta_ejecucion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dc_levantamiento: {
            type: DataTypes.STRING,
            allowNull: true
         },
        id_documento: {
             type: DataTypes.UUID,
             allowNull: false,
             references: {
              model: 'TipoDocumentoComplementarios',
                 key: 'id',
             },
             unique:true
        },
        id_ejecucionMC: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'EjecucionMCs',
                key: 'id',
            },       
        },

        id_estado: { 
            type: DataTypes.UUID,
            allowNull: false,
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
