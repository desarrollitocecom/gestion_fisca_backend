const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Entidad = sequelize.define('Entidad', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
