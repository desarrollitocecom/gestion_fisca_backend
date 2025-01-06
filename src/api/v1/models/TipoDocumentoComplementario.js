const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TipoDocumentoComplementario = sequelize.define('TipoDocumentoComplementario', {
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
        tableName: 'TipoDocumentoComplementarios',
        timestamps: true
    });

    return TipoDocumentoComplementario;
};
