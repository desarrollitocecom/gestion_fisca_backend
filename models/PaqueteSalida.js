const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PaqueteSalida = sequelize.define(
        "PaqueteSalida",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            id_paquete:{
                type: DataTypes.UUID,
                references: {
                    model: 'Paquetes',
                    key: 'id',
                },
                allowNull:true
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
                allowNull: true,
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            tableName: "PaqueteSalidas",
            timestamps: true,
        }
    );

    return PaqueteSalida;
};
