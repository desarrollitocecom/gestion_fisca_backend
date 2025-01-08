const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RSG2 = sequelize.define('RSG2', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rsg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_rsg: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_RSG: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('PLATAFORMA_SANCION','RSG', 'RSA', '', 'ACTA', 'AR3', 'ANALISTA_5', 'ARCHIVO_AR3', 'TERMINADO'),
            allowNull: true
        },
        id_evaluar_rsg: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        id_descargo_RSG: {
            type: DataTypes.UUID,
            references: {
                model: 'DescargoRSAs',
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
        id_AR2: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: false
        }
    }, {
        tableName: 'RSG2s',
        timestamps: true
    });
    RSG2.associate = (db) => {
        RSG2.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        
        RSG2.belongsTo(db.RSG, { foreignKey: 'id_evaluar_rsg', as: 'RSGs', constraints: false });
        RSG2.belongsTo(db.RG, { foreignKey: 'id_evaluar_rsg', as: 'RGs', constraints: false });
        RSG2.belongsTo(db.Acta, { foreignKey: 'id_evaluar_rsg', as: 'ActaRsa', constraints: false });

        RSG2.belongsTo(db.DescargoRSA, { foreignKey: 'id_descargo_RSG', as: 'DescargoRSAs' });
        RSG2.belongsTo(db.Usuario, { foreignKey: 'id_AR2', as: 'Usuarios' });   
    };
    return RSG2;
};