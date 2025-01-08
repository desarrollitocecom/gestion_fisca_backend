const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const ResolucionSancionadora = sequelize.define('ResolucionSancionadora', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rsa: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha_rsa: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        fecha_notificacion_rsa: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_RSA: {
            type: DataTypes.STRING,
            allowNull: true
        },

        tipo: {
            type: DataTypes.ENUM('RECURSO_RECONC', 'RECURSO_APELAC'),
            allowNull: true
        },

        id_evaluar_rsa: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        estado: {
            type: DataTypes.ENUM('PLATAFORMA_SANCION', 'ARCHIVO'),
            allowNull: true
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
        tableName: 'ResolucionesSancionadoras',
        timestamps: true
    });
    ResolucionSancionadora.associate = (db) => {
        ResolucionSancionadora.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        
        ResolucionSancionadora.belongsTo(db.RSG, { foreignKey: 'id_evaluar_rsa', as: 'RSGs', constraints: false });
        ResolucionSancionadora.belongsTo(db.RG, { foreignKey: 'id_evaluar_rsa', as: 'RGs', constraints: false });
        ResolucionSancionadora.belongsTo(db.Acta, { foreignKey: 'id_evaluar_rsa', as: 'ActaRsa', constraints: false });

        ResolucionSancionadora.belongsTo(db.Usuario, { foreignKey: 'id_AR2', as: 'Usuarios' });   
    };
    return ResolucionSancionadora;
};