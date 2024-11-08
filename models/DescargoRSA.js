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
        documento_descargo: {
            type: DataTypes.STRING,
            allowNull: false
        },
   
        //  id_AR3:{
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'Analista3',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }

    }, {
        tableName: 'DescargoRSAs',
        timestamps: true
    });
    return DescargoRSA;
};