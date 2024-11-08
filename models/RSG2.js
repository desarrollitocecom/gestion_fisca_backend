const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const RSG2 = sequelize.define('RSG2', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_resolucion2: {
            type: DataTypes.STRING,
            allowNull: false

        },
        fecha_resolucion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //  id_AR2: {
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'AResolutiva2s',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }

    }, {
        tableName: 'RSG2s',
        timestamps: true
    })
    return RSG2;
};