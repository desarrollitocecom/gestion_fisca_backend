const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EstadoIFI = sequelize.define('EstadoIFI', {
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
        tableName: 'EstadoIFIs',
        timestamps: true
    });
    
    return EstadoIFI;
};
