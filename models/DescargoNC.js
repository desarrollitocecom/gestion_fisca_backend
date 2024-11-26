const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const DescargoNC=sequelize.define('DescargoNC',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_descargo:{
          type:DataTypes.STRING,
          allowNull: true
        },
        id_estado:{
            type: DataTypes.INTEGER,
            references: {
                model: 'EstadoDescargoNCs',
                key: 'id',
            },
            allowNull: true
        },
        fecha_descargo:{
          type:DataTypes.DATE,
          allowNull: true
        },
        documento:{
            type:DataTypes.STRING,
            allowNull: true
        },
        id_analista1:{
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true
        },
    }, {
        tableName: 'DescargoNCs',
        timestamps: true
    });


    DescargoNC.associate = (db) => {
        DescargoNC.belongsTo(db.EstadoDescargoNC, { foreignKey: 'id_estado', as: 'estadoDescargoNC' });
    };

    
    return DescargoNC;
}

