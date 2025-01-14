const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RSG = sequelize.define('RSG', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rsg: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha_rsg: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_RSG: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM('RSGP', 'RSGNP', 'GERENCIA', 'TERMINADO', 'ANALISTA_5'),
            allowNull: true
        },
        id_constancia_inexigibilidad: {
            type: DataTypes.UUID,
            eferences: {
                model: 'ConstanciasInexigibilidades',
                key: 'id',
            },
            allowNull: true,
        },
        id_recurso_apelacion: {
            type: DataTypes.UUID,
            references: {
                model: 'RecursosApelaciones',
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
        id_AR3: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: false
        },

        id_cargoNotificacion:{
            type: DataTypes.UUID,
            references: {
                model: 'CargoNotificaciones',
                key: 'id',
            },
            allowNull: true,
        },

    }, {
        tableName: 'RSGs',
        timestamps: true
    });

    RSG.associate = (db) => {

        RSG.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        RSG.belongsTo(db.RecursoApelacion, { foreignKey: 'id_recurso_apelacion', as: 'RecApelaciones' });

        RSG.belongsTo(db.ConstanciaInexigibilidad, { foreignKey: 'id_constancia_inexigibilidad', as: 'InexiRSG' });

        
        
        RSG.belongsTo(db.Usuario, { foreignKey: 'id_AR3', as: 'rsgUsuario' });
        RSG.belongsTo(db.CargoNotificacion,{foreignKey:'id_cargoNotificacion' , as:'cargoNotifi' });

    };
    return RSG;
};