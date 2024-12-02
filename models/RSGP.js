const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RSGP = sequelize.define('RSGP', {
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
        documento_RSGP: {
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
            unique:true
        },
         id_AR3:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }

    }, {
        tableName: 'RGSPs',
        timestamps: true
    });

    RSGP.associate = (db) => {
        // Relación de 1 a 1 entre RSGP 

        RSGP.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
    return RSGP;
};