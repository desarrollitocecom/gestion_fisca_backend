const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const CargoNotificacion = sequelize.define('CargoNotificacion', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        numero_cargoNotificacion: {
            type: DataTypes.STRING,
            allowNull: true
        },

        tipo: {
            type: DataTypes.ENUM('IFI', 'RSG', 'RSA', 'RG'),
            allowNull: true
        },
        
        fecha1: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        documento1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fecha2: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        documento2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        estado_visita: {
            type: DataTypes.ENUM('VISITA-1', 'VISITA-2'),
            allowNull: true
        },

        estado_entrega: {
            type: DataTypes.ENUM('PERSONA', 'PUERTA'),
            allowNull: true
        },
        
        id_motorizado: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true, 
        },  

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        hora: {
            type: DataTypes.TIME,
            allowNull: true
        },

        id_inspector: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true, 
        }, 
     
    }, {
        tableName: 'CargoNotificaciones',
        timestamps: true
    });
    CargoNotificacion.associate = (db) => {
        CargoNotificacion.belongsTo(db.Usuario, { foreignKey: 'id_motorizado', as: 'usuarioMotorizado' })   
    };

    return CargoNotificacion;
};