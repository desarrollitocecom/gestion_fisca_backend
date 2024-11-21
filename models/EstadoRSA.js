const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EstadoRSA = sequelize.define('EstadoRSA', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }

        
    }, {
        tableName: 'EstadoRSAs',
        timestamps: true
    });
    
    return EstadoMC;
};