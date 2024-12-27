const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const RangoActa = sequelize.define('RangoActa', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        rango_inicio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        rango_final: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        observaciones_inicio: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        observaciones_final: {
            type: DataTypes.TEXT,
            allowNull: true
        },  

        fecha_laburo: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        estado: {
            type: DataTypes.ENUM('INICIADO', 'FINALIZADO'),
            allowNull: true
        },


        id_inspector: {
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true, 
        },    
        
        id_encargadoInicio:{
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true
        },

        id_encargadoFin:{
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true
        },


    }, {
        tableName: 'RangoActas',
        timestamps: true
    });
    RangoActa.associate = (db) => {
        RangoActa.belongsTo(db.Usuario, { foreignKey: 'id_inspector', as: 'usuarioInspector' })   
        RangoActa.belongsTo(db.Usuario, { foreignKey: 'id_encargadoInicio', as: 'usuarioEncargadoInicio' })  
        RangoActa.belongsTo(db.Usuario, { foreignKey: 'id_encargadoFin', as: 'usuarioEncargadoFin' })  
    };

    return RangoActa;
};