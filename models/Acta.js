const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Acta = sequelize.define('Acta', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
      
        documento_Acta: {
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
        },    
        id_Analista_5:{
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: false
        }
    }, {
        tableName: 'Actas',
        timestamps: true
    });
    Acta.associate = (db) => {
        // Relación con DescargoActa
        Acta.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
       
   
    };


    return Acta;
};