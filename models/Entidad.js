const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Entidad = sequelize.define('Entidad', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        domicilio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        distrito: {
            type: DataTypes.STRING,
            allowNull: true
        },
        giro_uso: { 
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'Entidades',
        timestamps: true
    });

   
    return Entidad;
};
