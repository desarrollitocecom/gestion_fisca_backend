const { CargoNotificacion, IFI, ResolucionSubgerencial, ResolucionSancionadora, RSG, RG, TramiteInspector, NC } = require('../../../config/db_connection');
const { Sequelize } = require('sequelize');
const { saveImage, deleteFile } = require("../../../utils/fileUtils");

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


//aqui
const getAllCargoNotificacionForIFIController = async () => {
    console.log('holaaaa')
    try {
        // const response = await IFI.findAll({
        //     where: {
        //         [Sequelize.Op.and]: [
        //             Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'IFI'),
        //             {
        //                 [Sequelize.Op.or]: [
        //                     Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), null),
        //                     Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), 'NO_ESTA')
        //                 ]
        //             }
        //         ]
        //     },
        //     attributes: [
        //         'id',
        //         [Sequelize.col('cargoNotifi.id'), 'id_cargo'],
        //         [Sequelize.col('nro_ifi'), 'nro'],
        //         [Sequelize.col('id_nc'), 'id_nc'],
        //         [Sequelize.col('cargoNotifi.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
        //         [Sequelize.col('cargoNotifi.tipo'), 'tipo'],
        //         [Sequelize.col('cargoNotifi.fecha1'), 'fecha1'],
        //         [Sequelize.col('cargoNotifi.documento1'), 'documento1'],
        //         [Sequelize.col('cargoNotifi.fecha2'), 'fecha2'],
        //         [Sequelize.col('cargoNotifi.documento2'), 'documento2'],
        //         [Sequelize.col('cargoNotifi.estado_visita'), 'estado_visita'],
        //         [Sequelize.col('cargoNotifi.estado_entrega'), 'estado_entrega'],
        //         [Sequelize.col('cargoNotifi.id_motorizado'), 'id_motorizado'],
        //     ],
        //     include: [
        //         {
        //             model: CargoNotificacion,
        //             as: 'cargoNotifi',
        //             attributes: []
        //         }
        //     ]
        // });

        const response = await NC.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('IFI.cargoNotifi.tipo'), 'IFI'),
                    {
                        [Sequelize.Op.or]: [
                            Sequelize.where(Sequelize.col('IFI.cargoNotifi.estado_entrega'), null),
                            Sequelize.where(Sequelize.col('IFI.cargoNotifi.estado_entrega'), 'NO_ESTA')
                        ]
                    }
                ]
            },
            attributes: [
                [Sequelize.col('IFI.id'), 'id'],
                [Sequelize.col('IFI.cargoNotifi.id'), 'id_cargo'],
                [Sequelize.col('IFI.nro_ifi'), 'nro'],
                [Sequelize.col('IFI.id_nc'), 'id_nc'],
                [Sequelize.col('IFI.cargoNotifi.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
                [Sequelize.col('IFI.cargoNotifi.tipo'), 'tipo'],
                [Sequelize.col('IFI.cargoNotifi.fecha1'), 'fecha1'],
                [Sequelize.col('IFI.cargoNotifi.documento1'), 'documento1'],
                [Sequelize.col('IFI.cargoNotifi.fecha2'), 'fecha2'],
                [Sequelize.col('IFI.cargoNotifi.documento2'), 'documento2'],
                [Sequelize.col('IFI.cargoNotifi.estado_visita'), 'estado_visita'],
                [Sequelize.col('IFI.cargoNotifi.estado_entrega'), 'estado_entrega'],
                [Sequelize.col('IFI.cargoNotifi.id_motorizado'), 'id_motorizado'],
                [Sequelize.col('tramiteInspector.latitud'), 'latitud'],
                [Sequelize.col('tramiteInspector.longitud'), 'longitud'],
            ],
            include: [
                {
                    model: IFI,
                    as: 'IFI',
                    attributes: [],
                    include: [
                        {
                            model: CargoNotificacion,
                            as: 'cargoNotifi',
                            attributes: []
                        }
                    ]
                },
                {
                    model: TramiteInspector,
                    as: 'tramiteInspector',
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
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), {
                        [Sequelize.Op.in]: ['PUERTA', 'PERSONA']
                    })
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('nro_ifi'), 'nro'],
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


//
const getAllCargoNotificacionForRSGController = async () => {
    try {

        const response = await ResolucionSubgerencial.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSG'),
                    {
                        [Sequelize.Op.or]: [
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), null),
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), 'NO_ESTA')
                        ]
                    }
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('cargoNotifi.id'), 'id_cargo'],
                [Sequelize.col('nro_rsg'), 'nro'],
                [Sequelize.col('id_nc'), 'id_nc'],
                [Sequelize.col('cargoNotifi.numero_cargoNotificacion'), 'numero_cargoNotificacion'],
                [Sequelize.col('cargoNotifi.tipo'), 'tipo'],
                [Sequelize.col('cargoNotifi.fecha1'), 'fecha1'],
                [Sequelize.col('cargoNotifi.documento1'), 'documento1'],
                [Sequelize.col('cargoNotifi.fecha2'), 'fecha2'],
                [Sequelize.col('cargoNotifi.documento2'), 'documento2'],
                [Sequelize.col('cargoNotifi.estado_visita'), 'estado_visita'],
                [Sequelize.col('cargoNotifi.estado_entrega'), 'estado_entrega'],
                [Sequelize.col('cargoNotifi.id_motorizado'), 'id_motorizado'],
                [Sequelize.col('NCs.tramiteInspector.latitud'), 'latitud'],
                [Sequelize.col('NCs.tramiteInspector.longitud'), 'longitud'],

            ],
            include: [
                {
                    model: CargoNotificacion,
                    as: 'cargoNotifi',
                    attributes: []
                },
                {
                    model: NC,
                    as: 'NCs',
                    attributes: [],
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        },
                    ]
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
        const response = await ResolucionSubgerencial.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSG'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), { [Sequelize.Op.ne]: null })
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('nro_rsg'), 'nro'],
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

const getAllCargoNotificacionForRSAController = async () => {
    try {
        const response = await ResolucionSancionadora.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSA'),
                    {
                        [Sequelize.Op.or]: [
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), null),
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), 'NO_ESTA')
                        ]
                    }
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('cargoNotifi.id'), 'id_cargo'],
                [Sequelize.col('nro_rsa'), 'nro'],
                [Sequelize.col('id_nc'), 'id_nc'],
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

const getAllHistoryCargoNotificacionForRSAController = async () => {
    try {

        const response = await ResolucionSancionadora.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSA'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), { [Sequelize.Op.ne]: null })
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('nro_rsa'), 'nro'],
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

const getAllCargoNotificacionForRSG2Controller = async () => {
    try {
        const response = await RSG.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSG2'),
                    {
                        [Sequelize.Op.or]: [
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), null),
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), 'NO_ESTA')
                        ]
                    }
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('cargoNotifi.id'), 'id_cargo'],
                [Sequelize.col('nro_rsg'), 'nro'],
                [Sequelize.col('id_nc'), 'id_nc'],
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

const getAllHistoryCargoNotificacionForRSG2Controller = async () => {
    try {

        const response = await RSG.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RSG2'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), { [Sequelize.Op.ne]: null })
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('nro_rsg'), 'nro'],
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







const getAllCargoNotificacionForRGController = async () => {
    try {
        const response = await RG.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RG'),
                    {
                        [Sequelize.Op.or]: [
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), null),
                            Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), 'NO_ESTA')
                        ]
                    }
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('cargoNotifi.id'), 'id_cargo'],
                [Sequelize.col('nro_rg'), 'nro'],
                [Sequelize.col('id_nc'), 'id_nc'],
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

const getAllHistoryCargoNotificacionForRGController = async () => {
    try {

        const response = await RG.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.col('cargoNotifi.tipo'), 'RG'),
                    Sequelize.where(Sequelize.col('cargoNotifi.estado_entrega'), { [Sequelize.Op.ne]: null })
                ]
            },
            attributes: [
                'id',
                [Sequelize.col('nro_rg'), 'nro'],
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


const getCargoNotificacionController = async ({ id }) => {
    try {
        const response = await CargoNotificacion.findOne({
            where: {
                id: id
            }
        })

        return response
    } catch (error) {
        console.log(error);
        return false
    }
}

//aqui
const updateCargoNotificacionController = async (id, { numero_cargoNotificacion, fecha1, estado_visita, fecha2, estado_entrega, documento1, evidencia1, documento2, evidencia2, id_motorizado, numero_cargoNotificacion2 }) => {
    let documento_path_1;
    let evidencia_path_1;
    let documento_path_2;
    let evidencia_path_2
    try {


        if (documento1) {
            console.log('asd');

            documento_path_1 = saveImage(documento1, "Notificacion Cargo IFI 1");
        }
        if (evidencia1) {
            console.log('asd');

            evidencia_path_1 = saveImage(evidencia1, "Evidencia Cargo IFI 1");
        }
        if (documento2) {
            documento_path_2 = saveImage(documento2, "Notificacion Cargo IFI 2");
        }

        if (evidencia2) {
            evidencia_path_2 = saveImage(evidencia2, "Evidencia Cargo IFI 2");
        }


        const response = await CargoNotificacion.findOne({
            where: {
                id: id
            }
        })

        const res = await response.update({ numero_cargoNotificacion, fecha1, fecha2, estado_visita, estado_entrega, documento1: documento_path_1, evidencia1: evidencia_path_1, evidencia2: evidencia_path_2, documento2: documento_path_2, id_motorizado, numero_cargoNotificacion2 })
        //console.log(res);

        return res || null

    } catch (error) {
        if (documento_path_1) {
            deleteFile(documento_path_1);
        }
        if (evidencia_path_1) {
            deleteFile(evidencia_path_1);
        }
        if (documento_path_2) {
            deleteFile(documento_path_2);
        }
        if (evidencia_path_2) {
            deleteFile(evidencia_path_2);
        }
        console.error("Error al crear el Informe Final desde el Controlador:", error);
        return false;
    }
}

module.exports = {
    createCargoNotificacionController, getAllCargoNotificacionForIFIController, getAllHistoryCargoNotificacionForRSGController,
    getAllHistoryCargoNotificacionForIFIController, getAllCargoNotificacionForRSGController, getAllCargoNotificacionForRSAController, getAllHistoryCargoNotificacionForRSAController,
    getAllCargoNotificacionForRSG2Controller, getAllHistoryCargoNotificacionForRSG2Controller, getCargoNotificacionController, updateCargoNotificacionController,
    getAllHistoryCargoNotificacionForRGController, getAllCargoNotificacionForRGController

};
