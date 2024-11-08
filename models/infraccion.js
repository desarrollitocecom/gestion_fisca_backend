const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Infraccion = sequelize.define('Infraccion', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        actividad_economica: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        monto: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        lugar_infraccion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'Infracciones',
        timestamps: true
    });

    return Infraccion;
};
