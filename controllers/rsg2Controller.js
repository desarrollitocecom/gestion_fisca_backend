const { RSG2} = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const {saveImage,deleteFile}=require('../utils/fileUtils')
const { RSG1, NC, TramiteInspector, Usuario, DescargoNC, IFI, DescargoIFI } = require('../db_connection'); 
const { Sequelize } = require('sequelize');


// Función para crear una nueva instancia de RSG2
const createRSG2Controller = async ({nro_resolucion2, fecha_resolucion, documento,id_nc,id_AR2}) => {
    let documento_path;
    try {
        documento_path=saveImage(documento,'Resolucion(RSG2)')       
        const newRSG2 = await RSG2.create({
            nro_resolucion2,
            fecha_resolucion,
            documento: documento_path,
            id_nc,
            id_AR2
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
const getRSG2Controller=async (id) => {
    try {
        const response=await RSG2.findByPk(id)
        return response || null 
    } catch (error) {
        console.error('Error  crear RSG2:', error);
        return false;
    }
}

const updateRSG2Controller = async ({id, nro_resolucion2, fecha_resolucion, documento,id_nc,id_AR2}) => {
    let documento_path;
    try {
        // documento_path=saveImage(documento,'Resolucion(RSG2)')  ;

        const rsg2 = await RSG2.findOne({ where: { id } });
        documento_path=rsg2.documento
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
                documento:documento_path,
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

const getAllRSG2forAR2Controller = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await NC.findAndCountAll({ 
            limit,
            offset,
            // where: Sequelize.where(Sequelize.col('IFI.tipo'), 'TERMINADO_RSG1'),
            order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'usuarioInspector'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.col('tramiteInspector.documento_acta'), 'documento_acta'],
                [Sequelize.col('tramiteInspector.createdAt'), 'inspector_createdAt'],

                [Sequelize.col('digitadorUsuario.usuario'), 'usuarioDigitador'],

                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'usuarioAnalista1'],
                [Sequelize.col('descargoNC.documento'), 'documento_descargoNC'],
                [Sequelize.col('descargoNC.createdAt'), 'analista_createdAt'],

                [Sequelize.col('IFI.Usuarios.usuario'), 'usuarioAreaInstructiva1'],
                [Sequelize.col('IFI.documento_ifi'), 'documento_AI'],
                [Sequelize.col('IFI.createdAt'), 'AI_createdAt'],

                [Sequelize.col('IFI.DescargoIFIs.analista2Usuario.usuario'), 'usuarioAnalista2'],
                [Sequelize.col('IFI.DescargoIFIs.documento_DIFI'), 'documento_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.createdAt'), 'analista2_createdAt'],

                [Sequelize.col('IFI.RSG2.Usuarios.usuario'), 'usuarioAreaInstructiva2'],
                // [Sequelize.col('IFI.RSG2.documento_DIFI'), 'documento_DIFI'],
                // [Sequelize.col('IFI.RSG2.createdAt'), 'analista2_createdAt'],


                // [Sequelize.col('IFI.TERMINADO_RSG1.Usuarios.usuario'), 'usuarioRSG1'],
                // [Sequelize.col('IFI.TERMINADO_RSG1.documento'), 'documento_RSG1'],
                // [Sequelize.col('IFI.TERMINADO_RSG1.createdAt'), 'RSG1_createdAt'],
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
                            as: 'Usuarios',
                        },
                        {
                            model: DescargoIFI,
                            as: 'DescargoIFIs',
                            include: [
                                {
                                    model: Usuario,
                                    as: 'analista2Usuario',
                                },
                            ]
                        },
                        {
                            model: RSG2,
                            as: 'RSG2',
                            include: [
                                {
                                    model: Usuario,
                                    as: 'Usuarios',
                                },
                            ]
                        },
                    ],
                    attributes: [], 
                },
            ]
        });

        const transformedData = response.rows.map(row => ({
            // id: row.id,
            // nro_nc: row.nro_nc,
            etapaInspector: {
                usuarioInspector: row.get('usuarioInspector'),
                documento_nc: row.get('documento_nc'),
                documento_acta: row.get('documento_acta'),
                inspector_createdAt: row.get('inspector_createdAt'),
            },
            etapaDigitador: {
                usuarioDigitador: row.get('usuarioDigitador'),
            },
            estapaDescargoNC: {
                usuarioAnalista1: row.get('usuarioAnalista1'),
                documento_descargoNC: row.get('documento_descargoNC'),
                analista_createdAt: row.get('analista_createdAt'),
            },
            etapaAreaInstructiva: {
                usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
                documento_AI: row.get('documento_AI'),
                AI_createdAt: row.get('AI_createdAt'),
            },
            etapaDescargoIFI: {
                usuarioAnalista2: row.get('usuarioAnalista2'),
                documento_descargoIFI: row.get('documento_DIFI'),
                analista2_createdAt: row.get('analista2_createdAt'),
            },
            
            etapaRSG2: {
                usuarioRSG1: row.get('usuarioRSG1'),
                documento_RSG1: row.get('documento_RSG1'),
                RSG1_createdAt: row.get('RSG1_createdAt'),
            },
            // usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
        }));


        return { totalCount: response.count, data: transformedData, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};




module.exports = {
    createRSG2Controller,
    updateRSG2Controller,
    getRSG2Controller,
    getAllRSG2forAR2Controller
}