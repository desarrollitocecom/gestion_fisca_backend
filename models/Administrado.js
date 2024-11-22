const { DataTypes } = require("sequelize");
module.exports=(sequelize)=>{
    const Administrado=sequelize.define('Administrado',{
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nombres:{
          type:DataTypes.STRING,
          allowNull: true
        },
        apellidos:{
          type:DataTypes.STRING,
          allowNull: true
        },
        domicilio:{
            type:DataTypes.STRING,
            allowNull: true
        },
        distrito:{
            type:DataTypes.STRING,
            allowNull: true
        },
        giro:{
            type:DataTypes.STRING,
            allowNull: true
        },       
    }, {
        tableName: 'Administrados',
        timestamps: true
    });

    Administrado.associate = (db) => {
        Administrado.hasMany(db.NC, { foreignKey: 'id_administrado', as: 'nc'})
    }

    return Administrado;
}