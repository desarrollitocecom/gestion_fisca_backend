const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EstadoRSGNP = sequelize.define('EstadoRSGNP', {
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
        tableName: 'EstadoRSGNPs',
        timestamps: true
    });
    
    return EstadoRSGNP;
};