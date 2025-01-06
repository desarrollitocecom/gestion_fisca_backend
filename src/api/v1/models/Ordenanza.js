const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Ordenanza = sequelize.define(
        "Ordenanza",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            tableName: "Ordenanzas",
            timestamps: true,
        }
    );

    return Ordenanza;
};
