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
        id_descargo_RSGNP:{
            type:DataTypes.UUID,
            references: {
                model: 'DescargoRSGNPs',
                key: 'id',
            },
            allowNull:true,
            unique:true
        },
        id_rg:{
            type:DataTypes.UUID,
            references: {
                model: 'RGs',
                key: 'id',
            },
            allowNull:true,
            unique:true
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
        id_estado_RSGNP:{
            type: DataTypes.INTEGER,
            references: {
                model: 'EstadoRSGNPs',
                key: 'id',
            },
            allowNull:true
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
        tableName: 'RGSNPs',
        timestamps: true
    });
    
    RSGNP.associate = (db) => {
        // Relación con DescargoRG
        RSGNP.belongsTo(db.RG, { foreignKey: 'id_rg', as: 'RGs' });
        RSGNP.belongsTo(db.DescargoRSGNP, { foreignKey: 'id_descargo_RSGNP', as: 'DescargoRSGNPs' });
        RSGNP.belongsTo(db.EstadoRSGNP, { foreignKey: 'id_estado_RSGNP', as: 'estadoIFI'})
        RSGNP.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
    return RSGNP;
};