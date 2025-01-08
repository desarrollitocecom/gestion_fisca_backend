const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RSA = sequelize.define('RSA', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rsa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_rsa: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_RSA: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('PLATAFORMA_SANCION','RSG', 'RSA', '', 'ACTA', 'AR3', 'ANALISTA_5', 'ARCHIVO_AR3', 'TERMINADO'),
            allowNull: true
        },
        id_evaluar_rsa: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        id_descargo_RSA: {
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
        tableName: 'RSAs',
        timestamps: true
    });
    RSA.associate = (db) => {
        RSA.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        
        RSA.belongsTo(db.RSG, { foreignKey: 'id_evaluar_rsa', as: 'RSGs', constraints: false });
        RSA.belongsTo(db.RG, { foreignKey: 'id_evaluar_rsa', as: 'RGs', constraints: false });
        RSA.belongsTo(db.Acta, { foreignKey: 'id_evaluar_rsa', as: 'ActaRsa', constraints: false });

        RSA.belongsTo(db.DescargoRSA, { foreignKey: 'id_descargo_RSA', as: 'DescargoRSAs' });
        RSA.belongsTo(db.Usuario, { foreignKey: 'id_AR2', as: 'Usuarios' });   
    };
    return RSA;
};