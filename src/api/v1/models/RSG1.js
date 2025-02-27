const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const RSG1 = sequelize.define('RSG1', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_resolucion: {
            type: DataTypes.STRING,
            allowNull: false

        },
        fecha_resolucion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
        },
         id_AR1: {
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }

    }, {
        tableName: 'RSG1s',
        timestamps: true
    })
    RSG1.associate = (db) => {
        // Relación de 1 a 1 entre RSG1 y los tipos basados en 'tipo'
        RSG1.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        RSG1.belongsTo(db.Usuario,{foreignKey:'id_AR1' , as:'Usuarios' });

    };
    return RSG1;
};