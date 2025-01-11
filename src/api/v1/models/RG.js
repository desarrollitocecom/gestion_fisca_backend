const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const RG = sequelize.define('RG', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rg: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha_rg: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_rg: {
            type: DataTypes.STRING,
            allowNull: true
        },

        tipo: {
            type: DataTypes.ENUM('FUNDADO', 'ANALISTA_5', 'TERMINADO', 'TERMINADO_GERENCIA'),
            allowNull: true
        },
        
        id_const_inexigibilidad: {
            type: DataTypes.UUID,
            references: {
                model: 'ConstanciasInexigibilidades',
                key: 'id',
            },
            allowNull: true,
        },

        id_nc: {
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
        },
        id_gerente: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true
        },
    }, {
        tableName: 'RGs',
        timestamps: true
    });
    RG.associate = (db) => {

        RG.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        RG.belongsTo(db.ConstanciaInexigibilidad, { foreignKey: 'id_const_inexigibilidad', as: 'ConstInexigibilidad' });
        RG.belongsTo(db.Usuario, { foreignKey: 'id_gerente', as: 'Usuarios' });
        
    };

    return RG;
};