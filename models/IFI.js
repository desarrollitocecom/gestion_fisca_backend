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
            allowNull: true
        },
        id_evaluar: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        id_descargo_ifi:{
            type: DataTypes.UUID,
            references: {
                model: 'DescargoIFIs',
                key: 'id',
            },
            allowNull: true,
            unique:true
        },
        id_nc:{
            type: DataTypes.UUID,
            references: {
                model: 'NCs',
                key: 'id',
            },
            allowNull: true,
            unique:true
        },
        id_estado_IFI:{
            type: DataTypes.INTEGER,
            references: {
                model: 'EstadoIFIs',
                key: 'id',
            },
            allowNull:false
        },
        id_AI1:{
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: false
        }
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
        IFI.belongsTo(db.DescargoIFI, { foreignKey: 'id_descargo_ifi', as: 'DescargoIFIs' });
        IFI.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        IFI.belongsTo(db.EstadoIFI, { foreignKey: 'id_estado_IFI', as: 'estadoIFI'})

   
    };


    return IFI;
};