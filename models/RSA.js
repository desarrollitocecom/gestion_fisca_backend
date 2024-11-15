const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RSA = sequelize.define('RSA', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rsa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_rsa: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_RSA: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo:{
            type:DataTypes.ENUM('RSGP','RSGNP'),
            allowNull:true
        },
        id_evaluar_rsa:{
            type:DataTypes.UUID,
            allowNull:true,
         },
         id_descargo_RSA:{
             type: DataTypes.UUID,
             references: {
                 model: 'DescargoRSAs',
                 key: 'id',
             },
             allowNull: true,
             unique:true
         }, 
        //  id_AR2:{
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'AResolutiva2s',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }
    }, {
        tableName: 'RSAs',
        timestamps: true
    });
    RSA.associate = (db) => {
        // Relación con DescargoRSA
        RSA.belongsTo(db.DescargoRSA, { foreignKey: 'id_descargo_RSA', as: 'DescargoRSAs' });
    };
    return RSA;
};