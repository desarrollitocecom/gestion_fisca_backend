const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Paquete = sequelize.define(
        "Paquete",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            rangoInicio: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            rangoFinal: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            cantidadTotal: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fechaRegistro: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "Paquetes",
            timestamps: true,
        }
    );

    return Paquete;
};
