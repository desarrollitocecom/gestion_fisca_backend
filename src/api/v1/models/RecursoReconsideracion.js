const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RecursoReconsideracion = sequelize.define('RecursoReconsideracion', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_recurso: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha_recurso: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento: {
            type: DataTypes.STRING,
            allowNull: true
        },

        id_rsg: {
            type: DataTypes.UUID,
            references: {
                model: 'RSGs',
                key: 'id',
            },
            allowNull: true,
        },

        id_original: {
            type: DataTypes.UUID,
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

        id_plataforma2: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: false
        }
    }, {
        tableName: 'RecursosReconsideraciones',
        timestamps: true
    });
    RecursoReconsideracion.associate = (db) => {
        RecursoReconsideracion.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        RecursoReconsideracion.belongsTo(db.Usuario, { foreignKey: 'id_plataforma2', as: 'RecursoReconUsuario' });   
        RecursoReconsideracion.belongsTo(db.RSG, { foreignKey: 'id_rsg', as: 'RSGs' });   
        RecursoReconsideracion.belongsTo(db.RSG, { foreignKey: 'id_original', as: 'RSG2_Original', constraints: false });
    };
    return RecursoReconsideracion;
};