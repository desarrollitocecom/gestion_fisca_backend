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
            allowNull: true
        },
        fecha_descargo: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_DIFI: {
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

        id_estado:{
            type: DataTypes.INTEGER,
            references: {
                model: 'EstadoDescargoIFIs',
                key: 'id',
            },
            allowNull: true
        },


        id_analista_2:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull: true
         }

    }, {
        tableName: 'DescargoIFIs',
        timestamps: true
    });
    DescargoIFI.associate = (db) => {
        // Relación de 1 a 1 entre DescargoIFI y los tipos basados en 'tipo'
        //DescargoIFI.belongsTo(db.EstadoDescargoIFI, { foreignKey: 'id_estado', as: 'estadoDescargoIFI' });
        DescargoIFI.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        DescargoIFI.belongsTo(db.Usuario, { foreignKey: 'id_analista_2', as: 'analista2Usuario' })
    };
 


    return DescargoIFI;
};