const { CargoNotificacion, IFI } = require('../../../config/db_connection');
const { Sequelize } = require('sequelize');

const createCargoNotificacionController = async ({
    tipo
}) => {
    try {
        const newCargoNotificacion = await CargoNotificacion.create({
            tipo
        });

        return newCargoNotificacion || null;

    } catch (error) {
        console.error('Error creando Cargo Notificacion:', error);
        return false;
    }
};


const getAllCargoNotificacionForIFIController = async () => {
    try {
        const response = await IFI.findAll({
            where: Sequelize.where(Sequelize.col('CargoNotificaciones.tipo'), 'TIPO'),
            attributes: [
                'id', 
                'nro_ifi',
                [Sequelize.col('CargoNotificaciones.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
                [Sequelize.col('CargoNotificaciones.tipo'), 'tipo'],
                [Sequelize.col('CargoNotificaciones.fecha1'), 'fecha1'],
                [Sequelize.col('CargoNotificaciones.documento1'), 'documento1'],
                [Sequelize.col('CargoNotificaciones.fecha2'), 'fecha2'],
                [Sequelize.col('CargoNotificaciones.documento2'), 'documento2'],
                [Sequelize.col('CargoNotificaciones.estado_visita'), 'estado_visita'],
                [Sequelize.col('CargoNotificaciones.estado_entrega'), 'estado_entrega'],
                [Sequelize.col('CargoNotificaciones.id_motorizado'), 'id_motorizado'],
            ],
            include: [
                {
                    model: CargoNotificacion,
                    as: 'CargoNotificaciones',
                    attributes: [] 
                }
            ]
        });
    
        return response || null;
    } catch (error) {
        console.error('Error creando Cargo Notificacion:', error);
        return false;
    }
    
};



module.exports = { createCargoNotificacionController, getAllCargoNotificacionForIFIController };
