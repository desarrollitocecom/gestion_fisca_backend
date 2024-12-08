const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const RSG2 = sequelize.define('RSG2', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_resolucion2: {
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
         id_AR2: {
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }

    }, {
        tableName: 'RSG2s',
        timestamps: true
    })
    RSG2.associate = (db) => {
        // Relación de 1 a 1 entre RSG2 y los tipos basados en 'tipo'

        RSG2.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
    return RSG2;
};