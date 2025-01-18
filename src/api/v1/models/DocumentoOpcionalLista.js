const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DocumentoOpcionalLista = sequelize.define('DocumentoOpcionalLista', {
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
        total_DocumentoOpcionalLista: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false
        }
        

    }, {
        tableName: 'DocumentosOpcionalesLista',
        timestamps: true
    });
    DocumentoOpcionalLista.associate = (db) => {
        DocumentoOpcionalLista.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
    return DocumentoOpcionalLista;
};