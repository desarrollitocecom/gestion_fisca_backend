const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Entidad = sequelize.define('Entidad', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        nombre_entidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        domicilio_entidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        distrito_entidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        giro_entidad: { 
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'Entidades',
        timestamps: true
    });

   
    return Entidad;
};
