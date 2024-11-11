const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const NC=sequelize.define('NC',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        id_tramiteInspector:{
            type: DataTypes.UUID,
            references: {
                model: 'TramiteInspectores',
                key: 'id',
            },
            allowNull: false
        },
        id_digitador:{
            type:DataTypes.STRING,
            allowNull:false
        },
        id_tipoDocumento:{
            type: DataTypes.UUID,
            references: {
                model: 'TipoDocumentoIdentidades',
                key: 'id',
            },
            allowNull:false
        },
        nro_documento:{
            type:DataTypes.UUID,
            allowNull:false
        },
        id_administrado:{
            type: DataTypes.UUID,
            references: {
                model: 'Administrados',
                key: 'id',
            },
            allowNull:false
        },
        id_entidad:{
            type: DataTypes.UUID,
            references: {
                model: 'Entidades',
                key: 'id',
            },
            allowNull:false
        },
        nro_licencia_funcionamiento:{
            type:DataTypes.UUID,
            allowNull:false
        },
        id_infraccion:{
            type: DataTypes.UUID,
            references: {
                model: 'Infracciones',
                key: 'id',
            },
            allowNull:false
        },
        placa_rodaje:{
            type:DataTypes.STRING,
            allowNull:false
        },
        fecha_detencion:{
            type:DataTypes.DATE,
            allowNull:false
        },
        fecha_notificacion:{
            type:DataTypes.DATE,
            allowNull:false
        },
        observaciones:{
            type:DataTypes.STRING,
            allowNull:false
        },
        id_medida_complementaria:{
            type: DataTypes.UUID,
            references: {
                model: 'MedidaComplementarias',
                key: 'id',
            },
            allowNull:false
        },
        id_descargo_NC:{
            type: DataTypes.UUID,
            references: {
                model: 'DescargoNCs',
                key: 'id',
            },
            allowNull:false
        },
        id_nro_IFI:{
            type: DataTypes.UUID,
            references: {
                model: 'IFIs',
                key: 'id',
            },
            allowNull:false
        },
        id_estado_NC:{
            type: DataTypes.UUID,
            references: {
                model: 'EstadoNCs',
                key: 'id',
            },
            allowNull:false
        },
        id_const_noti:{
            type: DataTypes.UUID,
            references: {
                model: 'ConstanciaNotificaciones',
                key: 'id',
            },
            allowNull:false
        },

    }, {
        tableName: 'NCs',
        timestamps: true
    });


    NC.associate = (db) => {

        NC.belongsTo(db.TramiteInspector, { foreignKey: 'id_tramiteInspector', as: 'tramiteInspector'})
        
        NC.belongsTo(db.Administrado, { foreignKey: 'id_administrado', as: 'administrado'})
        NC.belongsTo(db.TipoDocumentoIdentidad, { foreignKey: 'id_tipoDocumento', as: 'DocIdentidad'})
        NC.belongsTo(db.Entidad, { foreignKey: 'id_entidad', as: 'entidad'})
        NC.belongsTo(db.Infraccion, { foreignKey: 'id_infraccion', as: 'infraccion'})
        NC.belongsTo(db.MedidaComplementaria, { foreignKey: 'id_medida_complementaria', as: 'medidaComplementaria'})
        NC.belongsTo(db.ConstanciaNotificacion, { foreignKey: 'id_const_noti', as: 'ConstNotifi'})
        NC.belongsTo(db.EstadoNC, { foreignKey: 'id_estado_NC', as: 'estadoNC'})
        NC.belongsTo(db.IFI, { foreignKey: 'id_nro_IFI', as: 'IFI'})
        NC.belongsTo(db.DescargoNC, { foreignKey: 'id_descargo_NC', as: 'descargoNC'})
    }

    return NC;
}