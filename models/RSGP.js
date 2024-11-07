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
   
        //  id_AR3:{
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'AResolutiva3',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }

    }, {
        tableName: 'RGSPs',
        timestamps: true
    });
    return RSGP;
};