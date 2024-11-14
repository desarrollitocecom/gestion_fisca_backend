const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Infraccion = sequelize.define('Infraccion', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        actividad_economica: {
            type: DataTypes.STRING,
            allowNull: true
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        monto: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        lugar_infraccion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'Infracciones',
        timestamps: true
    });


    Infraccion.associate = (db) => {
        Infraccion.hasMany(db.NC, { foreignKey: 'id_tramiteInspector', as: 'nc'})
    }

    return Infraccion;
};
