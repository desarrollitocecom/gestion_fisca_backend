const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoIFI = sequelize.define('DescargoIFI', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_descargo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_descargo: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_DIFI: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
            
        },
        id_analista_2:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: false
         }

    }, {
        tableName: 'DescargoIFIs',
        timestamps: true
    });
    DescargoIFI.associate = (db) => {
        // Relación de 1 a 1 entre DescargoIFI y los tipos basados en 'tipo'

        DescargoIFI.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
    };
 


    return DescargoIFI;
};