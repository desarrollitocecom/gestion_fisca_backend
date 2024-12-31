const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const MovimientoActa = sequelize.define(
        "MovimientoActa",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            tipo: {
                type: DataTypes.ENUM('entrada', 'salida', 'asignacion', 'realizacion', 'devolucion'),
                allowNull: false,
            },
            cantidad: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            id_doc: {
                type: DataTypes.UUID,
                references: {
                    model: 'Docs',
                    key: 'id',
                },
                allowNull: true, 
            },
            id_encargado: {
                type: DataTypes.UUID,
                references: {
                    model: 'Usuarios',
                    key: 'id',
                },
                allowNull: true, 
            }, 
            detalle: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "MovimientoActas",
            timestamps: true,
        }
    );

    return MovimientoActa;
};
