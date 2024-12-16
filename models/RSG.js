const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const RSG = sequelize.define('RSG', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rsg: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha_rsg: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_RSG: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tipo:{
            type:DataTypes.ENUM('RSGP','RSGNP','GERENCIA','TERMINADO', 'ANALISTA_5'),
            allowNull:true
        },
        id_evaluar_rsg:{
            type:DataTypes.UUID,
            allowNull:true,
         },
        id_descargo_RSG:{
            type:DataTypes.UUID,
            references: {
                model: 'DescargoRSGs',
                key: 'id',
            },
            allowNull:true,
        },
        // id_rg:{
        //     type:DataTypes.UUID,
        //     references: {
        //         model: 'RGs',
        //         key: 'id',
        //     },
        //     allowNull:true,
        // },
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
        },
         id_AR3:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }

    }, {
        tableName: 'RSGs',
        timestamps: true
    });

    RSG.associate = (db) => {
        RSG.belongsTo(db.RG, { foreignKey: 'id_evaluar_rsg', as: 'RGs', constraints: false });
        RSG.belongsTo(db.DescargoRSG, { foreignKey: 'id_descargo_RSG', as: 'DescargoRSGs' });
        RSG.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        RSG.belongsTo(db.Usuario,{foreignKey:'id_AR3' , as:'Usuarios' });
    };
    return RSG;
};