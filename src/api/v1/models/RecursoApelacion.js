const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RecursoApelacion = sequelize.define('RecursoApelacion', {
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

        // estado: {
        //     type: DataTypes.ENUM('PLATAFORMA_SANCION', 'ARCHIVO'),
        //     allowNull: true
        // },

        id_gerencia: {
            type: DataTypes.UUID,
            references: {
                model: 'RGs',
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

        id_plataforma2: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: false
        },

        id_original: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    }, {
        tableName: 'RecursosApelaciones',
        timestamps: true
    });
    RecursoApelacion.associate = (db) => {
        RecursoApelacion.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        RecursoApelacion.belongsTo(db.Usuario, { foreignKey: 'id_plataforma2', as: 'Usuarios' });   

        RecursoApelacion.belongsTo(db.RG, { foreignKey: 'id_gerencia', as: 'RGs' });
        RecursoApelacion.belongsTo(db.RG, { foreignKey: 'id_original', as: 'RG_Original', constraints: false });

    };
    return RecursoApelacion;
};