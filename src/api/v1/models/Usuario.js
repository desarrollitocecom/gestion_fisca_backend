const { DataTypes } = require("sequelize");

const argon2 = require('argon2');

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        usuario: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        contraseña: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        dni: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true
        },
        token: {
            type: DataTypes.STRING(500), // Token
            allowNull: true,
            defaultValue: null
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Usuarios',
        timestamps: true,
        //  hooks: { // encripta la contraseña al guardarla y al cambiarla
        //      beforeCreate: async (usuario) => {
        //          usuario.contraseña = await argon2.hash(usuario.contraseña);
        //      },
        //      beforeUpdate: async (usuario) => {
        //          if (usuario.changed('contraseña')) {
        //              usuario.contraseña = await argon2.hash(usuario.contraseña);
        //          }
        //      }
        //  }
    });


    Usuario.associate = (db) => {
    //     // Usuario - Empleado (1 a 1)
    //     Usuario.belongsTo(db.Empleado, {
    //         foreignKey: { name: 'id_empleado', allowNull: true, unique: true },
    //         as: 'empleado',
    //     });
    
         // Usuario - Rol (Muchos a uno)
         Usuario.belongsTo(db.Rol, {
            foreignKey: { name: 'id_rol', allowNull: false },
            as: 'rol'
       });
     };

    return Usuario;
};