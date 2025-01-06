const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MedidaComplementaria = sequelize.define('MedidaComplementaria', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },

        nombre_MC: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nro_medida_complementaria: {
            type: DataTypes.STRING,
            allowNull: true
        },

        documento_medida_complementaria: {
            type: DataTypes.STRING,
            allowNull: true
       },
        
        numero_ejecucion: {///////////////////
            type: DataTypes.STRING,
            allowNull: true
        },


        tipo_ejecucionMC: {///////////////////
            type: DataTypes.STRING,
            allowNull: true
        },

        documento_ejecucion: {///////////////////
            type: DataTypes.STRING,
            allowNull: true
        },
    
       
        // nro_levantamiento: {///////////////////
        //     type: DataTypes.INTEGER,
        //     allowNull: true
        // },
        
        // dc_levantamiento: {///////////////////
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        estado: {  /////////
            type: DataTypes.ENUM('PENDIENTE', 'REALIZADO'),
            allowNull: true,
        },

        id_usuarioMC: {///////////////////
            type: DataTypes.UUID,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true
        }

    }, {
        tableName: 'MedidaComplementarias',
        timestamps: true
    });

    MedidaComplementaria.associate = (db) => {
        MedidaComplementaria.belongsTo(db.Usuario,{foreignKey:'id_usuarioMC' , as:'Usuarios' });
    };

    return MedidaComplementaria;
};
