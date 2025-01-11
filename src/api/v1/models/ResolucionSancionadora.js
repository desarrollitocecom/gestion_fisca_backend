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

        tipo_evaluar: {
            type: DataTypes.ENUM('RECURSO_RECONC', 'RECURSO_APELAC', 'CONST_INEXIGIBILIDAD'),
            allowNull: true
        },

        id_evaluar_rsa: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        estado: {
            type: DataTypes.ENUM('PLATAFORMA_SANCION', 'ARCHIVO', 'ANALISTA_5'),
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
        tableName: 'ResolucionesSancionadoras',
        timestamps: true
    });
    ResolucionSancionadora.associate = (db) => {
        ResolucionSancionadora.belongsTo(db.NC, { foreignKey: 'id_nc', as: 'NCs' });
        
        ResolucionSancionadora.belongsTo(db.RSG, { foreignKey: 'id_evaluar_rsa', as: 'RSGs', constraints: false });
        ResolucionSancionadora.belongsTo(db.RG, { foreignKey: 'id_evaluar_rsa', as: 'RGs', constraints: false });
        ResolucionSancionadora.belongsTo(db.ConstanciaInexigibilidad, { foreignKey: 'id_evaluar_rsa', as: 'ConstInexigibilidad', constraints: false });

        ResolucionSancionadora.belongsTo(db.Usuario, { foreignKey: 'id_AR2', as: 'Usuarios' });   
        ResolucionSancionadora.belongsTo(db.CargoNotificacion,{foreignKey:'id_cargoNotificacion' , as:'cargoNotifi' });

    };
    return ResolucionSancionadora;
};