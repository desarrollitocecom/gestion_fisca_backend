const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const Documento = sequelize.define('Documento', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
        },
        total_documentos: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false
        }
        

    }, {
        tableName: 'Documentos',
        timestamps: true
    });
    Documento.associate = (db) => {
        // Relación de 1 a 1 entre Documento y los tipos basados en 'tipo'
        Documento.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
    return Documento;
};