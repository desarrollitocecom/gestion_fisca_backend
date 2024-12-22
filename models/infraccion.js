const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Infraccion = sequelize.define('Infraccion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        actividad_economica: {
            type: DataTypes.STRING,
            allowNull: true
        },
        codigo: {//////////////////////
            type: DataTypes.STRING,
            allowNull: true
        },
        descripcion: {//////////////
            type: DataTypes.TEXT,
            allowNull: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        monto: {////////////////
            type: DataTypes.DOUBLE,
            allowNull: true
        },
    }, {
        tableName: 'Infracciones',
        timestamps: true
    });


    // Infraccion.associate = (db) => {
    //     Infraccion.hasMany(db.NC, { foreignKey: 'id_tramiteInspector', as: 'nc'})
    // }

    return Infraccion;
};
