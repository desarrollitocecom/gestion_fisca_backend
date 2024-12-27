const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const ControlActa = sequelize.define('ControlActa', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        id_ragoActa: {
            type: DataTypes.UUID,
            references: {
                model: 'RangoActas',
                key: 'id',
            },
            allowNull: true, 
        }, 
        
        numero_acta: {
            type: DataTypes.INTEGER,
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

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        hora: {
            type: DataTypes.TIME,
            allowNull: true
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        
        estado: {
            type: DataTypes.ENUM('ENTREGADO', 'REALIZADO', 'DEVOLVIO', 'ANULADO'),
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


        
    }, {
        tableName: 'ControlActas',
        timestamps: true
    });
    ControlActa.associate = (db) => {
        ControlActa.belongsTo(db.Usuario, { foreignKey: 'id_inspector', as: 'usuarioInspector' })   
        ControlActa.belongsTo(db.Usuario, { foreignKey: 'id_encargado', as: 'usuarioEncargado' })  
    };

    return ControlActa;
};