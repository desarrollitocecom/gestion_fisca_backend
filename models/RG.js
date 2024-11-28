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
        estado:{
            type: DataTypes.ENUM('NP', 'P'),
            allowNull: true
        },
        documento_ac: {
            type: DataTypes.STRING,
            allowNull: false
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
         id_analista_5:{
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
        
    };
    
       return RG;
};