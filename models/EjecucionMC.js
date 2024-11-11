const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
    const EjecucionMC = sequelize.define('EjecucionMC', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
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
