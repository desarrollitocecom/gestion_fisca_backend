const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoRSGNP = sequelize.define('DescargoRSGNP', {
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
        documento_DRSGNP: {
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
         id_analista_4:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }

    }, {
        tableName: 'DescargoRSGNPs',
        timestamps: true
    });
    DescargoRSGNP.associate = (db) => {
        // Relación de 1 a 1 entre DescargoRSGNP y los tipos basados en 'tipo'
        DescargoRSGNP.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
    return DescargoRSGNP;
};