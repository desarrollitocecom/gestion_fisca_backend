const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Acta = sequelize.define('Acta', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        nro_acta: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fecha_acta: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
      
        documento_acta: {
            type: DataTypes.STRING,
            allowNull: true
        },

        tipo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true, 
        },    
        id_analista_5:{
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true
        }
    }, {
        tableName: 'Actas',
        timestamps: true
    });
    Acta.associate = (db) => {
        // Relación con DescargoActa
        Acta.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        Acta.belongsTo(db.Usuario, { foreignKey: 'id_analista_5', as: 'analista5Usuario' })  
    };


    return Acta;
};