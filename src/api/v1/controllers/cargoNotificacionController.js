const { CargoNotificacion, IFI, ResolucionSubgerencial } = require('../../../config/db_connection');
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
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'IFI'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), null)
                ]
            }, 
            attributes: [
                'id', 
                'nro_ifi',
                [Sequelize.col('cargoNotifi.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
                [Sequelize.col('cargoNotifi.tipo'), 'tipo'],
                [Sequelize.col('cargoNotifi.fecha1'), 'fecha1'],
                [Sequelize.col('cargoNotifi.documento1'), 'documento1'],
                [Sequelize.col('cargoNotifi.fecha2'), 'fecha2'],
                [Sequelize.col('cargoNotifi.documento2'), 'documento2'],
                [Sequelize.col('cargoNotifi.estado_visita'), 'estado_visita'],
                [Sequelize.col('cargoNotifi.estado_entrega'), 'estado_entrega'],
                [Sequelize.col('cargoNotifi.id_motorizado'), 'id_motorizado'],
            ],
            include: [
                {
                    model: CargoNotificacion,
                    as: 'cargoNotifi',
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

const getAllHistoryCargoNotificacionForIFIController = async () => {
    try {
        const response = await IFI.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'IFI'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), { [Sequelize.Op.ne]: null })
                ]
            },
            attributes: [
                'id', 
                'nro_ifi',
                [Sequelize.col('cargoNotifi.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
                [Sequelize.col('cargoNotifi.tipo'), 'tipo'],
                [Sequelize.col('cargoNotifi.fecha1'), 'fecha1'],
                [Sequelize.col('cargoNotifi.documento1'), 'documento1'],
                [Sequelize.col('cargoNotifi.fecha2'), 'fecha2'],
                [Sequelize.col('cargoNotifi.documento2'), 'documento2'],
                [Sequelize.col('cargoNotifi.estado_visita'), 'estado_visita'],
                [Sequelize.col('cargoNotifi.estado_entrega'), 'estado_entrega'],
                [Sequelize.col('cargoNotifi.id_motorizado'), 'id_motorizado'],
            ],
            include: [
                {
                    model: CargoNotificacion,
                    as: 'cargoNotifi',
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


const getAllCargoNotificacionForRSGController = async () => {
    try {
        const response2 = await ResolucionSubgerencial.findAll();
        
        const response = await ResolucionSubgerencial.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSG'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), null )
                ]
            },
            attributes: [
                'id', 
                'nro_rsg',
                [Sequelize.col('cargoNotifi.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
                [Sequelize.col('cargoNotifi.tipo'), 'tipo'],
                [Sequelize.col('cargoNotifi.fecha1'), 'fecha1'],
                [Sequelize.col('cargoNotifi.documento1'), 'documento1'],
                [Sequelize.col('cargoNotifi.fecha2'), 'fecha2'],
                [Sequelize.col('cargoNotifi.documento2'), 'documento2'],
                [Sequelize.col('cargoNotifi.estado_visita'), 'estado_visita'],
                [Sequelize.col('cargoNotifi.estado_entrega'), 'estado_entrega'],
                [Sequelize.col('cargoNotifi.id_motorizado'), 'id_motorizado'],
            ],
            include: [
                {
                    model: CargoNotificacion,
                    as: 'cargoNotifi',
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

const getAllHistoryCargoNotificacionForRSGController = async () => {
    try {
        const response2 = await ResolucionSubgerencial.findAll();
        
        const response = await ResolucionSubgerencial.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSG'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), { [Sequelize.Op.ne]: null } )
                ]
            },
            attributes: [
                'id', 
                'nro_rsg',
                [Sequelize.col('cargoNotifi.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
                [Sequelize.col('cargoNotifi.tipo'), 'tipo'],
                [Sequelize.col('cargoNotifi.fecha1'), 'fecha1'],
                [Sequelize.col('cargoNotifi.documento1'), 'documento1'],
                [Sequelize.col('cargoNotifi.fecha2'), 'fecha2'],
                [Sequelize.col('cargoNotifi.documento2'), 'documento2'],
                [Sequelize.col('cargoNotifi.estado_visita'), 'estado_visita'],
                [Sequelize.col('cargoNotifi.estado_entrega'), 'estado_entrega'],
                [Sequelize.col('cargoNotifi.id_motorizado'), 'id_motorizado'],
            ],
            include: [
                {
                    model: CargoNotificacion,
                    as: 'cargoNotifi',
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

module.exports = { createCargoNotificacionController, getAllCargoNotificacionForIFIController, getAllHistoryCargoNotificacionForRSGController, getAllHistoryCargoNotificacionForIFIController, getAllCargoNotificacionForRSGController };
