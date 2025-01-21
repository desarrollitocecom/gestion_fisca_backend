const { RSG2 } = require('../../../config/db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const { saveImage, deleteFile } = require('../../../utils/fileUtils')
const { RSG1, NC, TramiteInspector, Usuario, DescargoNC, IFI, DescargoIFI, ResolucionSubgerencial, RecursoReconsideracion, RSG, RG, RecursoApelacion, ConstanciaInexigibilidad, ResolucionSancionadora } = require('../../../config/db_connection');
const { Sequelize } = require('sequelize');
const { Op, col } = Sequelize;

// Función para crear una nueva instancia de RSG2
const createRSG2Controller = async ({ nro_rsg, fecha_rsg, tipo, id_nc, id_AR2, estado, id_cargoNotificacion, documento_RSG }) => {
    let documento_path;
    try {
        documento_path = saveImage(documento_RSG, 'Resolucion(RSG2)')
        const newRSG2 = await ResolucionSubgerencial.create({
            nro_rsg, fecha_rsg, tipo, id_nc, id_AR2, estado, id_cargoNotificacion, documento_RSG: documento_path
        });

        return newRSG2 || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear RSG2:', error);
        return false;
    }
};


const getRSG2Controller = async (id) => {
    try {
        const response = await RSG2.findByPk(id)
        return response || null
    } catch (error) {
        console.error('Error  crear RSG2:', error);
        return false;
    }
}

const updateRSG2Controller = async ({ id, nro_resolucion2, fecha_resolucion, documento, id_nc, id_AR2 }) => {
    let documento_path;
    try {
        // documento_path=saveImage(documento,'Resolucion(RSG2)')  ;

        const rsg2 = await RSG2.findOne({ where: { id } });
        documento_path = rsg2.documento
        if (documento) {
            documento_path = saveImage(documento, 'Resolucion(RSG2)');
            if (rsg2.documento) {
                deleteFile(rsg2.documento);
            }
        }
        if (rsg2) {
            await rsg2.update({
                nro_resolucion2,
                fecha_resolucion,
                documento: documento_path,
                id_nc,
                id_AR2
            });
        }

        return rsg2 || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar RSG2:', error);
        return false;
    }
};

const getAllRSG2forAR2Controller = async () => {
    try {
        const response = await NC.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(col('IFI.RSG2.tipo'), 'A_TODO'),
                ]
            },
            order: [['createdAt', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
            ],
            include: [
                {
                    model: TramiteInspector,
                    as: 'tramiteInspector',
                    include: [
                        {
                            model: Usuario,
                            as: 'inspectorUsuario'
                        }
                    ],
                    attributes: [],
                },
                {
                    model: Usuario,
                    as: 'digitadorUsuario',
                    attributes: []
                },
                {
                    model: DescargoNC,
                    as: 'descargoNC',
                    include: [
                        {
                            model: Usuario,
                            as: 'analistaUsuario'
                        }
                    ],
                    attributes: [],
                },
                {
                    model: IFI,
                    as: 'IFI',
                    include: [
                        {
                            model: Usuario,
                            as: 'ifiUsuario',
                            attributes: []
                        },
                        {
                            model: DescargoIFI,
                            as: 'DescargoIFIs',
                            include: [
                                {
                                    model: Usuario,
                                    as: 'analista2Usuario',
                                    attributes: []
                                },
                            ],
                            attributes: []
                        },
                        {
                            model: ResolucionSubgerencial,
                            as: 'RSG2',
                            attributes: []
                        },
                    ],
                    attributes: [],
                },
            ]
        });

        const transformedData = response.map(row => ({
            id: row.get('id'),
            nro_nc: row.get('nro_nc'),
        }));


        return transformedData || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};



const getAllRSG2forPlataformaController = async () => {
    try {
        //console.log('asd');
        
        const response = await ResolucionSubgerencial.findAll({
            where: {
                //estado: 'PLATAFORMA_SANCION',
                fecha_notificacion_rsg: { [Sequelize.Op.ne]: null },
                id_evaluar_rsg: null,
                estado: { [Sequelize.Op.ne]: 'ARCHIVO' }
            }
        });
        //console.log(response);
        const formattedResponse = response.map(item => ({
            id: item.id,
            numero: item.nro_rsg,
            createdAt: item.createdAt,
            id_nc: item.id_nc,
            tipo_viene: 'RSG'
        }));

        
        

        return formattedResponse || null;
    } catch (error) {
        return false
    }
}




module.exports = {
    createRSG2Controller,
    updateRSG2Controller,
    getRSG2Controller,
    getAllRSG2forAR2Controller,
    getAllRSG2forPlataformaController
}