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
          allowNull: false
        },
        apellidos:{
          type:DataTypes.STRING,
          allowNull: false
        },
        domicilio:{
            type:DataTypes.STRING,
            allowNull: false
        },
        distrito:{
            type:DataTypes.STRING,
            allowNull: false
        },
        giro:{
            type:DataTypes.STRING,
            allowNull: false
        },       
    }, {
        tableName: 'Administrados',
        timestamps: true
    });

    return Administrado;
}