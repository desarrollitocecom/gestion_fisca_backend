const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EjecucionMC = sequelize.define('EjecucionMC', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'EjecucionMCs',
        timestamps: true
    });

    EjecucionMC.associate = (db) => {
        EjecucionMC.hasOne(db.MedidaComplementaria, { foreignKey: 'id_ejecucionMC', as: 'medidaComplementaria' });
    };


    return EjecucionMC;
};
