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
            type:DataTypes.ENUM('ANALISTA_3','RSGP','RSGNP','ACTA','AR3','ANALISTA_5', 'TERMINADO'),
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
         id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
        },
        id_estado_RSA:{
            type: DataTypes.INTEGER,
            references: {
                model: 'EstadoRSAs',
                key: 'id',
            },
            allowNull:true
        },
         id_AR2:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }
    }, {
        tableName: 'RSAs',
        timestamps: true
    });
    RSA.associate = (db) => {
        // Relación con DescargoRSA
        RSA.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        RSA.belongsTo(db.DescargoRSA, { foreignKey: 'id_descargo_RSA', as: 'DescargoRSAs' });
        RSA.belongsTo(db.EstadoRSA, { foreignKey: 'id_estado_RSA', as: 'estadoRSA'})
        RSA.belongsTo(db.Usuario,{foreignKey:'id_AR2' , as:'Usuarios'});
        
        RSA.belongsTo(db.DescargoRSA, { foreignKey: 'id_evaluar_rsa', as: 'DRSA', constraints: false });

    };
    return RSA;
};