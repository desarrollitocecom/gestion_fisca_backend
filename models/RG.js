const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const RG = sequelize.define('RG', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nro_rg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_rg: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        documento_rg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('RSG1', 'RSA', 'RSG2'),
            allowNull: false
        },
        id_g: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        documento_ac: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        //  id_AI1:{
        //      type: DataTypes.UUID,
        //      references: {
        //          model: 'Analista5',
        //          key: 'id',
        //      },
        //      allowNull: false
        //  }
    }, {
        tableName: 'RGs',
        timestamps: true
    });
       return RG;
};