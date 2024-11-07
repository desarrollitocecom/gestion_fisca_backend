const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoRG = sequelize.define('RSGP', {
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
        //          model: 'Analista4',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }

    }, {
        tableName: 'DescargoRGs',
        timestamps: true
    });
    return DescargoRG;
};