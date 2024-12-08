const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const RG = sequelize.define('RG', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_rg: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_rg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        tipo:{
            type: DataTypes.ENUM('ACTA'),
            allowNull: true
        },
        id_evaluar_rg:{
            type:DataTypes.UUID,
            allowNull:true,
         },
       
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
        },
        id_estado_RG:{
            type: DataTypes.INTEGER,
            references: {
                model: 'EstadoRGs',
                key: 'id',
            },
            allowNull:true
        },
         id_gerente:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }
    }, {
        tableName: 'RGs',
        timestamps: true
    });
   RG.associate = (db) => {
     
       RG.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
       RG.belongsTo(db.EstadoRG, { foreignKey: 'id_estado_RG', as: 'estadoRG'})
        
    };
    
       return RG;
};