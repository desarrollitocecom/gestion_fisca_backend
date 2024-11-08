const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const IFI = sequelize.define('IFI', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_ifi: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_ifi: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('RSG1', 'RSA', 'RSG2'),
            allowNull: false
        },
        id_evaluar: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        id_descargo_ifi:{
            type: DataTypes.UUID,
            references: {
                model: 'DescargoIFIs',
                key: 'id',
            },
            allowNull: false
        },
        // id_AI1:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Analista1s',
        //         key: 'id',
        //     },
        //     allowNull: false
        // }


    }, {
        tableName: 'IFIs',
        timestamps: true
    });
    IFI.associate = (db) => {
        // Relación de 1 a 1 entre IFI y los tipos basados en 'tipo'
        IFI.belongsTo(db.RSA, { foreignKey: 'id_evaluar', as: 'RSA', constraints: false });
        IFI.belongsTo(db.RSG1, { foreignKey: 'id_evaluar', as: 'RSG1', constraints: false });
        IFI.belongsTo(db.RSG2, { foreignKey: 'id_evaluar', as: 'RSG2', constraints: false });

        // Relación con DescargoIFI
        IFI.hasOne(db.DescargoIFI, { foreignKey: 'id_descargo_ifi', as: 'DescargoIFIs' });
    };


    return IFI;
};