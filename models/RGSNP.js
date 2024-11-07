const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RSGNP = sequelize.define('RSGNP', {
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
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_RSGNP: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // id_descargo_RSGNP:{
        //     type:DataTypes.UUID,
        //     references: {
        //         model: 'DescargoRGs',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        // id_rg:{
        //     type:DataTypes.UUID,
        //     references: {
        //         model: 'RGs',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        //  id_AR3:{
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'AResolutiva3',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }

    }, {
        tableName: 'RGSNPs',
        timestamps: true
    });
    return RSGNP;
};