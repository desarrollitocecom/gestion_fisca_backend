const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const ResolucionSubgerencial = sequelize.define('ResolucionSubgerencial', {
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
        fecha_notificacion_rsg: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_RSG: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: 'ResolucionesSubgerenciales',
        timestamps: true
    });
    ResolucionSubgerencial.associate = (db) => {
        ResolucionSubgerencial.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        
        ResolucionSubgerencial.belongsTo(db.RSG, { foreignKey: 'id_evaluar_rsg', as: 'RSGs', constraints: false });
        ResolucionSubgerencial.belongsTo(db.RG, { foreignKey: 'id_evaluar_rsg', as: 'RGs', constraints: false });
        ResolucionSubgerencial.belongsTo(db.Acta, { foreignKey: 'id_evaluar_rsg', as: 'ActaRsa', constraints: false });

        ResolucionSubgerencial.belongsTo(db.Usuario, { foreignKey: 'id_AR2', as: 'Usuarios' });   
    };
    return ResolucionSubgerencial;
};