const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const ConstanciaInexigibilidad = sequelize.define('ConstanciaInexigibilidad', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        nro_ci: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fecha_ci: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
      
        documento_ci: {
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
        tableName: 'ConstanciasInexigibilidades',
        timestamps: true
    });
    ConstanciaInexigibilidad.associate = (db) => {
        // Relación con DescargoActa
        ConstanciaInexigibilidad.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        ConstanciaInexigibilidad.belongsTo(db.Usuario, { foreignKey: 'id_analista_5', as: 'analista5Usuario' })  
    };


    return ConstanciaInexigibilidad;
};