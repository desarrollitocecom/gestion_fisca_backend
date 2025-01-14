    const { DataTypes } = require("sequelize")
module.exports = (sequelize) => {
    const DescargoRSA = sequelize.define('DescargoRSA', {
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
        documento_DRSA: {
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
        
        // id_estado:{
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'EstadoDescargoRSAs',
        //         key: 'id',
        //     },
        //     allowNull: true
        // },

        id_analista_3:{
             type: DataTypes.UUID,
             references: {
                 model: 'Usuarios',
                 key: 'id',
             },
             allowNull3: true
         }

    }, {
        tableName: 'DescargoRSAs',
        timestamps: true
    });
    DescargoRSA.associate = (db) => {
        // Relación con NC
        DescargoRSA.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        //DescargoRSA.belongsTo(db.EstadoDescargoRSA, { foreignKey: 'id_estado', as: 'estadoDescargoRSA' });
        DescargoRSA.belongsTo(db.Usuario,{foreignKey:'id_analista_3' , as:'Usuarios' });

    };
    return DescargoRSA;
};