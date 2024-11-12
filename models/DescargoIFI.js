const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoIFI = sequelize.define('DescargoIFI', {
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

        documento_DIFI: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //id_analista2:{
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'DescargoRSAs',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  },

    }, {
        tableName: 'DescargoIFIs',
        timestamps: true
    });
 


    return DescargoIFI;
};