const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoRG = sequelize.define('DescargoRG', {
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
            unique:true
        }
        //  id_AR3:{
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'Analista4',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }

    }, {
        tableName: 'DescargoRGs',
        timestamps: true
    });
    DescargoRG.associate = (db) => {
        // Relación de 1 a 1 entre DescargoRG y los tipos basados en 'tipo'

        DescargoRG.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
    return DescargoRG;
};