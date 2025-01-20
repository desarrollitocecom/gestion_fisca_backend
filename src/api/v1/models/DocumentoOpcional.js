const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DocumentoOpcional = sequelize.define('DocumentoOpcional', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_docOpcional: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tipo_documentoOpcional: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha_docOpcional: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_opcional: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
            
        },

        id_plataforma:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: true
         }

    }, {
        tableName: 'DocumentosOpcionales',
        timestamps: true
    });
    DocumentoOpcional.associate = (db) => {
        DocumentoOpcional.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        DocumentoOpcional.belongsTo(db.Usuario, { foreignKey: 'id_plataforma', as: 'plataformaOpcionalUsuario' })
    };

    return DocumentoOpcional;
};