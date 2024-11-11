const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TipoDocumentoComplementario = sequelize.define('TipoDocumentoComplementario', {
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
        tableName: 'TipoDocumentoComplementarios',
        timestamps: true
    });

    return TipoDocumentoComplementario;
};
