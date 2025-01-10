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
            allowNull: true
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        fecha_notificacion: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        documento_ifi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM('ANALISTA_2', 'RSG1', 'RSA', 'RSG2','AR2', 'TERMINADO', 'TERMINADO_RSG1', 'TERMINADO_RSG2'),
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
           
        },
        id_AI1:{
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true
        },
        id_cargoNotificacion:{
            type: DataTypes.UUID,
            references: {
                model: 'CargoNotificaciones',
                key: 'id',
            },
            allowNull: true,
        },

        id_original: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        

    }, {
        tableName: 'IFIs',
        timestamps: true
    });
    IFI.associate = (db) => {
        // Relación de 1 a 1 entre IFI y los tipos basados en 'tipo'
        IFI.belongsTo(db.ResolucionSancionadora, { foreignKey: 'id_evaluar', as: 'RSA', constraints: false });
        // IFI.belongsTo(db.RSG1, { foreignKey: 'id_evaluar', as: 'TERMINADO_RSG1', constraints: false });
        IFI.belongsTo(db.ResolucionSubgerencial, { foreignKey: 'id_evaluar', as: 'RSG2', constraints: false });

        IFI.belongsTo(db.ResolucionSancionadora, { foreignKey: 'id_original', as: 'RSA_Original', constraints: false });
        IFI.belongsTo(db.ResolucionSubgerencial, { foreignKey: 'id_original', as: 'RSG_Original', constraints: false });

        // Relación con DescargoIFI
        IFI.belongsTo(db.DescargoIFI, { foreignKey: 'id_descargo_ifi', as: 'DescargoIFIs' });
        IFI.belongsTo(db.NC,{foreignKey:'id_nc',as:'NCs'});
        // IFI.belongsTo(db.EstadoIFI, { foreignKey: 'id_estado_IFI', as: 'estadoIFI'});
        IFI.belongsTo(db.Usuario,{foreignKey:'id_AI1' , as:'Usuarios' });
        IFI.belongsTo(db.CargoNotificacion,{foreignKey:'id_cargoNotificacion' , as:'cargoNotifi' });
   
    };


    return IFI;
};