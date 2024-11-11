const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TipoDocumentoIdentidad = sequelize.define('TipoDocumentoIdentidad', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
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