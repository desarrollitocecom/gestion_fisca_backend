const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
    const EjecucionMC = sequelize.define('EjecucionMC', {
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
        tableName: 'EjecucionMCs',
        timestamps: true
    });
    
    return EjecucionMC;
};
