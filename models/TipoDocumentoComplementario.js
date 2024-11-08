const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TipoDocumentoComplementario = sequelize.define('TipoDocumentoComplementario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
