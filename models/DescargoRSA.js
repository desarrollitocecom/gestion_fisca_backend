    const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoRSA = sequelize.define('DescargoRSA', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_descargo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_descargo: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_DRSA: {
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
         id_analista_3:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull3: false
         }

    }, {
        tableName: 'DescargoRSAs',
        timestamps: true
    });
    DescargoRSA.associate = (db) => {
        // Relación con NC
        DescargoRSA.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});

    };
    return DescargoRSA;
};