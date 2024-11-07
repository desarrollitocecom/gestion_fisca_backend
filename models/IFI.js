const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const IFI=sequelize.define('IFI',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_ifi:{
          type:DataTypes.STRING,
          allowNull: false
        },
        fecha:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },
        documento_ifi:{
            type:DataTypes.STRING,
            allowNull:false
        },
        tipo:{
            type:DataTypes.ENUM('RSG1','RSA','RSG2'),
            allowNull:false
        },
        id_evaluar:{
            type:DataTypes.UUID,
            allowNull:false,
        },
        id_descargo_ifi:{
            type: DataTypes.UUID,
            references: {
                model: 'DescargoIFIs',
                key: 'id',
            },
            allowNull: false
        },
        id_AI1:{
            type: DataTypes.UUID,
            references: {
                model: 'Analista1s',
                key: 'id',
            },
            allowNull: false
        }


    }, {
        tableName: 'IFIs',
        timestamps: true
    });


  

    return IFI;
}