const { RSG2} = require('../../../config/db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const {saveImage,deleteFile}=require('../../../utils/fileUtils')
const { RSG1, NC, TramiteInspector, Usuario, DescargoNC, IFI, DescargoIFI } = require('../../../config/db_connection'); 
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

const getAllRSG2forAR2Controller = async () => {
    try {
        const response = await NC.findAll({ 
            where: Sequelize.where(Sequelize.col('IFI.tipo'), 'TERMINADO_RSG2'),
            order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'usuarioInspector'],
                [Sequelize.literal(`'NOTIFICACION DE CARGO'`), 'nombre_nc'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.literal(`'ACTA DE FISCALIZACION'`), 'nombre_acta'],
                [Sequelize.col('tramiteInspector.documento_acta'), 'documento_acta'],
                [Sequelize.col('tramiteInspector.createdAt'), 'inspector_createdAt'],

                [Sequelize.col('digitadorUsuario.usuario'), 'usuarioDigitador'],

                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'usuarioAnalista1'],
                [Sequelize.literal(`'DESCARGO NC'`), 'nombre_descargoNC'],
                [Sequelize.col('descargoNC.documento'), 'documento_descargoNC'],
                [Sequelize.col('descargoNC.createdAt'), 'analista_createdAt'],

                [Sequelize.col('IFI.Usuarios.usuario'), 'usuarioAreaInstructiva1'],
                [Sequelize.literal(`'INFORME FINAL'`), 'nombre_AI'],
                [Sequelize.col('IFI.documento_ifi'), 'documento_AI'],
                [Sequelize.col('IFI.createdAt'), 'AI_createdAt'],

                [Sequelize.col('IFI.DescargoIFIs.analista2Usuario.usuario'), 'usuarioAnalista2'],
                [Sequelize.literal(`'DESCARGO IFI'`), 'nombre_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.documento_DIFI'), 'documento_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.createdAt'), 'analista2_createdAt'],

                [Sequelize.col('IFI.RSG2.Usuarios.usuario'), 'usuarioAreaInstructiva2'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL 2'`), 'nombre_AR2'],
                [Sequelize.col('IFI.RSG2.documento'), 'documento_AR2'],
                [Sequelize.col('IFI.RSG2.createdAt'), 'AR2_createdAt'],
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

        const transformedData = response.map(row => ({
            nro_nc: row.get('nro_nc'),
            etapaInspector: {
                usuarioInspector: row.get('usuarioInspector'),
                documento_nc: {
                    nombre: row.get('nombre_nc'),
                    path: row.get('documento_nc'),
                },
                documento_acta: {
                    nombre: row.get('nombre_acta'),
                    path: row.get('documento_acta'),
                },
                inspector_createdAt: row.get('inspector_createdAt'),
            },
            etapaDigitador: {
                usuarioDigitador: row.get('usuarioDigitador'),
                digitador_createdAt: row.get('inspector_createdAt'),
            },
            estapaDescargoNC: {
                usuarioAnalista1: row.get('usuarioAnalista1'),
                documento_descargoNC: {
                    nombre: row.get('nombre_descargoNC'),
                    path: row.get('documento_descargoNC')
                },
                analista_createdAt: row.get('analista_createdAt'),
            },
            etapaAreaInstructiva: {
                usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
                documento_AI: {
                    nombre: row.get('nombre_AI'),
                    path: row.get('documento_AI'),
                },
                AI_createdAt: row.get('AI_createdAt'),
            },
            etapaDescargoIFI: {
                usuarioAnalista2: row.get('usuarioAnalista2'),
                documento_descargoIFI: {
                    nombre: row.get('nombre_DIFI'),
                    path: row.get('documento_DIFI'),
                },
                analista2_createdAt: row.get('analista2_createdAt'),
            },
            etapaAR2: {
                usuarioAreaInstructiva2: row.get('usuarioAreaInstructiva2'),
                documento_AR2: {
                    nombre: row.get('nombre_AR2'),
                    path: row.get('documento_AR2'),
                },
                AR2_createdAt: row.get('AR2_createdAt'),
            },
            // usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
        }));


        return transformedData || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};



const getAllRSG2forPlataformaController = async () => {
    try {
      const response = await RSG2.findAll();
      return response || null;
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