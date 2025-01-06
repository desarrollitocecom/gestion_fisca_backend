const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoRSG = sequelize.define('DescargoRSG', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_descargo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha_descargo: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_DRSG: {
            type: DataTypes.STRING,
            allowNull: true
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
             allowNull: true
         }

    }, {
        tableName: 'DescargoRSGs',
        timestamps: true
    });
    DescargoRSG.associate = (db) => {
        DescargoRSG.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        DescargoRSG.belongsTo(db.Usuario, { foreignKey: 'id_analista_4', as: 'Usuarios' })

    };
    return DescargoRSG;
};