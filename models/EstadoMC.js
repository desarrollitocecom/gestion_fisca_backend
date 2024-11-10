const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EstadoMC = sequelize.define('EstadoMC', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }

        
    }, {
        tableName: 'EstadoMCs',
        timestamps: true
    });
    

    

    return EstadoMC;
};
