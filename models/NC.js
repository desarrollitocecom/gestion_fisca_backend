const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const NC=sequelize.define('NC',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        // id_tramiteInspector:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'TramiteInspector',
        //         key: 'id',
        //     },
        //     allowNull: false
        // },
        // id_digitador:{
        //     type:DataTypes.STRING,
        //     allowNull:false
        // },
        // id_tipoDocumento:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'TipoDocumentoIdentidad',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        nro_documento:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        // id_administrado:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Administrado',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        // id_entidad:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Entidad',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        nro_licencia_funcionamiento:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        // id_infraccion:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Infraccion',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
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
        // id_medida_complementaria:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'MedidaComplementaria',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        // id_descargo:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'DescagoNC',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        // id_nro_IFI:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'IFI',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        // id_estado_NC:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Estado_NC',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },
        // id_const_noti:{
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Constancia_Notificacion',
        //         key: 'id',
        //     },
        //     allowNull:false
        // },

    }, {
        tableName: 'NCs',
        timestamps: true
    });

    return NC;
}