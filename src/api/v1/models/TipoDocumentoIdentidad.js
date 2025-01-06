const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const TipoDocumentoIdentidad = sequelize.define('TipoDocumentoIdentidad', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        documento: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'TipoDocumentoIdentidades', 
        timestamps: true 
    });

    return TipoDocumentoIdentidad;
};