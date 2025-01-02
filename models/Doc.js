const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Doc = sequelize.define(
        "Doc",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            numero_acta: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            numero_actas: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            estado: {
                type: DataTypes.ENUM('almacenada', 'salida', 'asignada', 'realizada', 'devuelta'),
                allowNull: false,
                defaultValue: 'almacenada',
            },
            id_paquete: {
                type: DataTypes.UUID,
                references: {
                    model: 'Paquetes',
                    key: 'id',
                },
                allowNull: true, 
            }, 
            id_inspector: {
                type: DataTypes.UUID,
                references: {
                    model: 'Usuarios',
                    key: 'id',
                },
                allowNull: true, 
            }, 
        },
        {
            tableName: "Docs",
            timestamps: true,
        }
    );
    Doc.associate = (db) => {
        Doc.belongsTo(db.Paquete, { foreignKey: 'id_paquete', as: 'paquete'})
        Doc.belongsTo(db.Usuario, { foreignKey: 'id_inspector', as: 'usuarioInspector' })   
    };

    return Doc;
};
