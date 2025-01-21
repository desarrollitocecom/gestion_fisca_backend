const { RSG, Usuario, NC, TramiteInspector } = require("../../../config/db_connection");
const { saveImage, deleteFile } = require('../../../utils/fileUtils')
const { Sequelize } = require('sequelize');
const { RSG1, DescargoNC, IFI, DescargoIFI, RSG2, RSA, RG, ResolucionSancionadora, DescargoRSA, ConstanciaInexigibilidad, RecursoApelacion, RecursoReconsideracion, ResolucionSubgerencial } = require('../../../config/db_connection');
const myCache = require("../../../middlewares/cacheNodeStocked");
const { Op, col } = Sequelize;

const createRSGController = async ({ nro_rsg, fecha_rsg, documento_RSG, id_nc, id_AR3, tipo, id_cargoNotificacion }) => {

    let documento_path;
    try {
        if (documento_RSG) {
            documento_path = saveImage(documento_RSG, 'Resolucion(RSG)')
        }

        const newRgsnp = await RSG.create({
            nro_rsg,
            fecha_rsg,
            documento_RSG: documento_path,
            id_nc,
            id_AR3,
            tipo,
            id_cargoNotificacion
        });
        return newRgsnp;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error("Error creating RGSNP:", error);
        return false
    }
};

const updateRSGController = async (id, { id_recurso_apelacion, fecha_notificacion }) => {
    try {

        //console.log('datos RSG: ', id, 'y la apelacion creada: ', id_recurso_apelacion)

        const rsgnp = await getRSGController(id);

        await rsgnp.update({
            id_recurso_apelacion,
            fecha_notificacion
        });

        return rsgnp || null
    } catch (error) {

        console.error("Error updating RGSNP:", error);
        return false

    }
}

const getRSGController = async (id) => {
    try {
        console.log(id)
        const rgsnp = await RSG.findOne({
            where: { id }
        })

        return rgsnp || null;
    } catch (error) {
        console.error("Error fetching RGSNP:", error);
        return false
    }
};






const updateRsgnpController = async (id, { nro_rsg, id_evaluar_rsgnp, tipo, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg, id_nc, id_estado_RSGNP, id_AR3 }) => {

    try {


        const rsgnp = await getRsgnpController(id);

        if (rsgnp) {
            await rsgnp.update({
                nro_rsg,
                fecha_rsg,
                fecha_notificacion,
                documento_RSGNP,
                id_descargo_RSGNP,
                id_evaluar_rsgnp,
                id_rg,
                tipo,
                id_nc,
                id_estado_RSGNP,
                id_AR3
            });
        }
        return rsgnp || null
    } catch (error) {

        console.error("Error updating RGSNP:", error);
        return false

    }
};

const getRsgnpController = async (id) => {
    try {
        const rgsnp = await RSG.findByPk(id)

        return rgsnp || null;
    } catch (error) {
        console.error("Error fetching RGSNP:", error);
        return false
    }
};
const getAllRSGNPforAN5Controller = async () => {
    try {
        const response = await RSGNP.findAll({
            where: { tipo: 'AN5' },
            order: [['id', 'ASC']],
            attributes: [
                'id',
                'id_AR3',
                'createdAt',
                'tipo',
                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'analista4'],
            ],
            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: [], // Si no necesitas atributos, está bien dejarlo vacío.
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: [] // No se requieren atributos de Usuario.
                },
            ],
        });

        // Asegúrate de devolver el resultado como un arreglo vacío si no hay datos
        return response ? response : [];
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los RSGNP para AN5", data: error });
        // Devuelve un arreglo vacío en caso de error para evitar problemas en el flujo
        return [];
    }
};


const getAllRsgnpController = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const rgsnps = await RSGNP.findAndCountAll({
            limit,
            offset,
            where: { tipo: null },
            attributes: ['id', 'id_AR3', 'createdAt',

                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'analista4'],
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });
        return { totalCount: rgsnps.count, data: rgsnps.rows, currentPage: page } || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};





const getAllRSGforAnalista4Controller = async () => {
    try {
        const response = await RSG.findAll({

            where: { tipo: 'RSGNP' },
            attributes: ['id', 'id_AR3', 'createdAt',

                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'area_resolutiva3'],
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });

        const modifiedResponse = response.map(item => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`AnalistaFour-${id}`); // Obtener valor del cache si existe

            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
            };
        });


        return modifiedResponse || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};


const updateRSGNPController = async (id, { id_descargo_RSG, id_estado_RSGNP, tipo, id_evaluar_rsg }) => {

    try {


        const rsgnp = await getRsgnpController(id);

        if (rsgnp) {
            await rsgnp.update({
                id_descargo_RSG,
                id_estado_RSGNP,
                tipo,
                id_evaluar_rsg
            });
        }
        return rsgnp || null
    } catch (error) {

        console.error("Error updating RGSNP:", error);
        return false

    }
};



const getAllRSGforGerenciaController = async () => {
    try {
        const response = await RSG.findAll({
            where: { tipo: 'GERENCIA' },
            attributes: ['id', 'id_AR3', 'createdAt',

                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'analista4'],
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });

        const modifiedResponse = response.map(item => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`Gerencia-${id}`); // Obtener valor del cache si existe

            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
            };
        });

        return modifiedResponse || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};



const getAllRSGforAnalista5Controller = async () => {
    try {
        const response = await RSG.findAll({
            where: { tipo: 'ANALISTA_5' },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'id_AR3',
                [Sequelize.col('NCs.id'), 'id_nc'],
                // [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                // [Sequelize.col('DescargoRSAs.Usuarios.usuario'), 'usuario'],
                [Sequelize.col('Usuarios.usuario'), 'usuario'],
                [Sequelize.literal(`'Analista 4'`), 'area'],
                'createdAt'
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });

        const modifiedResponse = response.map(item => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`AnalistaFive-AR4-${id}`); // Obtener valor del cache si existe

            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
            };
        });

        return modifiedResponse || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};




const getRSGforAnalista5Controller = async (id) => {
    try {
        const rgsnps = await RSG.findOne({
            where: { id: id },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'id_AR3',
                [Sequelize.col('NCs.id'), 'id_nc'],
                // [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                // [Sequelize.col('DescargoRSAs.Usuarios.usuario'), 'usuario'],
                [Sequelize.col('Usuarios.usuario'), 'usuario'],
                [Sequelize.literal(`'Analista 4'`), 'area'],
                'createdAt'
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });
        return rgsnps || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};






const getAllRSG3forAR3Controller1 = async () => {
    try {
        const response = await NC.findAll({
            where: Sequelize.where(Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.tipo'), 'RSGP'),
            order: [['id', 'ASC']],
            attributes: [
                'id',
                //TRAMITE INSPECTOR
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'usuarioInspector'],
                [Sequelize.literal(`'NOTIFICACION DE CARGO'`), 'nombre_nc'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.literal(`'ACTA DE FISCALIZACION'`), 'nombre_acta'],
                [Sequelize.col('tramiteInspector.documento_acta'), 'documento_acta'],
                [Sequelize.col('tramiteInspector.createdAt'), 'inspector_createdAt'],

                //                 //DIGITADOR
                [Sequelize.col('digitadorUsuario.usuario'), 'usuarioDigitador'],

                //                 //DESCARGO NC
                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'usuarioAnalista1'],
                [Sequelize.literal(`'DESCARGO NC'`), 'nombre_descargoNC'],
                [Sequelize.col('descargoNC.documento'), 'documento_descargoNC'],
                [Sequelize.col('descargoNC.createdAt'), 'analista_createdAt'],

                [Sequelize.col('IFI.ifiUsuario.usuario'), 'usuarioAreaInstructiva1'],
                [Sequelize.literal(`'INFORME FINAL'`), 'nombre_AI'],
                [Sequelize.col('IFI.documento_ifi'), 'documento_AI'],
                [Sequelize.col('IFI.createdAt'), 'AI_createdAt'],

                //Descargo IFI
                [Sequelize.col('IFI.DescargoIFIs.analista2Usuario.usuario'), 'usuarioAnalista2'],
                [Sequelize.literal(`'DESCARGO IFI'`), 'nombre_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.documento_DIFI'), 'documento_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.createdAt'), 'analista2_createdAt'],


                //RESOLUCION SUBGERENCIAL///////////////////////
                [Sequelize.col('IFI.RSG2.ResoSubUsuario.usuario'), 'usuarioResoSub'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL'`), 'nombre_ResoSub'],
                [Sequelize.col('IFI.RSG2.documento_RSG'), 'documento_ResoSub'],
                [Sequelize.col('IFI.RSG2.createdAt'), 'ResoSub_createdAt'],

                //RECONSIDERACION SUBGERENCIAL/////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RecursoReconUsuario.usuario'), 'usuarioReconsiSubg_Reconcideracion'],
                [Sequelize.literal(`'RECURSO DE RECONSIDERACION'`), 'nombre_ReconsiSubg_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.documento'), 'documento_ReconsiSubg_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.createdAt'), 'ReconsiSubg_createdAt_Reconcideracion'],

                //SUBGERENCIA////////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.rsgUsuario.usuario'), 'usuarioRSG_Reconcideracion'],
                [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_RSG_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.documento_RSG'), 'documento_RSG_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.createdAt'), 'RSG_createdAt_Reconcideracion'],


                //RESOLUCION SANCIONADORA
                [Sequelize.col('IFI.RSG2.ResoSubUsuario.usuario'), 'usuarioResoSanc'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL'`), 'nombre_ResoSanc'],
                [Sequelize.col('IFI.RSG2.documento_RSG'), 'documento_ResoSanc'],
                [Sequelize.col('IFI.RSG2.createdAt'), 'ResoSanc_createdAt'],
                //RECONSIDERACION SUBGERENCIAL
                [Sequelize.col('IFI.RSG2.Reconsideracion.RecursoReconUsuario.usuario'), 'usuarioReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.literal(`'RECURSO DE RECONSIDERACION'`), 'nombre_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.documento'), 'documento_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.createdAt'), 'ReconsiSubg_createdAt_Reconcideracion_Sanc'],

                //SUBGERENCIA
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.rsgUsuario.usuario'), 'usuarioRSG_Reconcideracion_Sanc'],
                [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_RSG_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.documento_RSG'), 'documento_RSG_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.createdAt'), 'RSG_createdAt_Reconcideracion_Sanc'],



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
                            include: [
                                {
                                    model: RecursoReconsideracion,
                                    as: 'Reconsideracion',
                                    include: [
                                        {
                                            model: RSG,
                                            as: 'RSGs',
                                            include: [

                                                {
                                                    model: Usuario,
                                                    as: 'rsgUsuario',
                                                    attributes: []
                                                },
                                            ],
                                            attributes: []
                                        },
                                        {
                                            model: Usuario,
                                            as: 'RecursoReconUsuario',
                                            attributes: []
                                        }
                                    ],
                                    attributes: []
                                },
                                {
                                    model: ConstanciaInexigibilidad,
                                    as: 'inexiResoSub',
                                    attributes: []
                                },
                                {
                                    model: Usuario,
                                    as: 'ResoSubUsuario',
                                    attributes: []
                                }
                            ],
                            attributes: []
                        },
                        {
                            model: ResolucionSancionadora,
                            as: 'RSA',
                            include: [
                                {
                                    model: RecursoReconsideracion,
                                    as: 'Reconsideracion',
                                    // include: [
                                    //     {
                                    //         model: RSG,
                                    //         as: 'RSGs',
                                    //         include: [
                                    //             {
                                    //                 model: RecursoApelacion,
                                    //                 as: 'RecApelaciones',
                                    //                 include: [
                                    //                     {
                                    //                         model: RG,
                                    //                         as: 'RGs',
                                    //                         include: [
                                    //                             {
                                    //                                 model: ConstanciaInexigibilidad,
                                    //                                 as: 'inexiRG',
                                    //                                 include: [
                                    //                                     {
                                    //                                         model: Usuario,
                                    //                                         as: 'ConstInexiUsuario',
                                    //                                         attributes: []
                                    //                                     }
                                    //                                 ],
                                    //                                 attributes: []
                                    //                             },
                                    //                             {
                                    //                                 model: Usuario,
                                    //                                 as: 'rgUsuario',
                                    //                                 attributes: []
                                    //                             }
                                    //                         ],
                                    //                         attributes: []
                                    //                     },
                                    //                     {
                                    //                         model: Usuario,
                                    //                         as: 'RecApelacionUsuario',
                                    //                         attributes: []
                                    //                     }
                                    //                 ],
                                    //                 attributes: []
                                    //             },
                                    //             {
                                    //                 model: ConstanciaInexigibilidad,
                                    //                 as: 'InexiRSG',
                                    //                 attributes: []
                                    //             },
                                    //             {
                                    //                 model: Usuario,
                                    //                 as: 'rsgUsuario',
                                    //                 attributes: []
                                    //             },
                                    //         ],
                                    //         attributes: []
                                    //     },
                                    //     {
                                    //         model: Usuario,
                                    //         as: 'RecursoReconUsuario',
                                    //         attributes: []
                                    //     }
                                    // ],
                                    attributes: []
                                },
                                // {
                                //     model: RecursoApelacion,
                                //     as: 'Apelacion',
                                //     include: [
                                //         {
                                //             model: RG,
                                //             as: 'RGs',
                                //             include: [
                                //                 {
                                //                     model: ConstanciaInexigibilidad,
                                //                     as: 'inexiRG',
                                //                     include: [
                                //                         {
                                //                             model: Usuario,
                                //                             as: 'ConstInexiUsuario',
                                //                             attributes: []
                                //                         }
                                //                     ],
                                //                     attributes: []
                                //                 },
                                //                 {
                                //                     model: Usuario,
                                //                     as: 'rgUsuario',
                                //                     attributes: []
                                //                 }
                                //             ],
                                //             attributes: []
                                //         },
                                //         {
                                //             model: Usuario,
                                //             as: 'RecApelacionUsuario',
                                //             attributes: []
                                //         }
                                //     ],
                                //     attributes: []
                                // },
                                {
                                    model: ConstanciaInexigibilidad,
                                    as: 'inexResoSanc',
                                    attributes: []
                                },
                                {
                                    model: Usuario,
                                    as: 'resoSancUsuario',
                                    attributes: []
                                }
                            ],
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
            etapaInspector: row.get('usuarioInspector') ? {
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
            } : undefined,
            etapaDigitador: row.get('usuarioDigitador') ? {
                usuarioDigitador: row.get('usuarioDigitador'),
                digitador_createdAt: row.get('inspector_createdAt'),
            } : undefined,
            estapaDescargoNC: row.get('usuarioAnalista1') ? {
                usuarioAnalista1: row.get('usuarioAnalista1'),
                documento_descargoNC: {
                    nombre: row.get('nombre_descargoNC'),
                    path: row.get('documento_descargoNC')
                },
                analista_createdAt: row.get('analista_createdAt'),
            } : undefined,

            etapaAreaInstructiva: row.get('usuarioAreaInstructiva1') ? {
                usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
                documento_AI: {
                    nombre: row.get('nombre_AI'),
                    path: row.get('documento_AI'),
                },
                AI_createdAt: row.get('AI_createdAt'),
            } : undefined,

            etapaDescargoIFI: row.get('usuarioAnalista2') ? {
                usuarioAnalista2: row.get('usuarioAnalista2'),
                documento_descargoIFI: {
                    nombre: row.get('nombre_DIFI'),
                    path: row.get('documento_DIFI'),
                },
                analista2_createdAt: row.get('analista2_createdAt'),
            } : undefined,

            etapaResolucionSubgerencial: row.get('usuarioReso_Sanc') ? {
                usuarioResoSub: row.get('usuarioReso_Sanc'),
                documento_ResolucionSubgerencial: {
                    nombre: row.get('nombre_Reso_Sanc'),
                    path: row.get('documento_Reso_Sanc'),
                },
                ResoSub_createdAt: row.get('ResoSanc_createdAt'),
            } : undefined,

            etapaRecursoReconsideracionSub: row.get('usuarioReconsiSubg_Reconcideracion_Sanc') ? {
                usuarioReconsiSubg_Reconcideracion: row.get('usuarioReconsiSubg_Reconcideracion_Sanc'),
                documento_RecursoReconsideracionSub: {
                    nombre: row.get('nombre_ReconsiSubg_Reconcideracion_Sanc'),
                    path: row.get('documento_ReconsiSubg_Reconcideracion_Sanc'),
                },
                ReconsiSubg_createdAt_Reconcideracion: row.get('ReconsiSubg_createdAt_Reconcideracion_Sanc'),
            } : undefined,

            etapaRSGReconsideracionSub: row.get('usuarioRSG_Reconcideracion_Sanc') ? {
                usuarioRSG_Reconcideracion: row.get('usuarioRSG_Reconcideracion_Sanc'),
                documento_RSGReconsideracionSub: {
                    nombre: row.get('nombre_RSG_Reconcideracion_Sanc'),
                    path: row.get('documento_RSG_Reconcideracion_Sanc'),
                },
                ReconsiSubg_createdAt_Reconcideracion: row.get('RSG_createdAt_Reconcideracion_Sanc'),
            } : undefined,
        }));


        return transformedData || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};


const getAllRSG3forAR3Controller2 = async () => {
    try {
        const response = await NC.findAll({
            where: Sequelize.where(Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.tipo'), 'RSGP'),
            order: [['id', 'ASC']],
            attributes: [
                'id',
                //TRAMITE INSPECTOR
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'usuarioInspector'],
                [Sequelize.literal(`'NOTIFICACION DE CARGO'`), 'nombre_nc'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.literal(`'ACTA DE FISCALIZACION'`), 'nombre_acta'],
                [Sequelize.col('tramiteInspector.documento_acta'), 'documento_acta'],
                [Sequelize.col('tramiteInspector.createdAt'), 'inspector_createdAt'],

                //                 //DIGITADOR
                [Sequelize.col('digitadorUsuario.usuario'), 'usuarioDigitador'],

                //                 //DESCARGO NC
                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'usuarioAnalista1'],
                [Sequelize.literal(`'DESCARGO NC'`), 'nombre_descargoNC'],
                [Sequelize.col('descargoNC.documento'), 'documento_descargoNC'],
                [Sequelize.col('descargoNC.createdAt'), 'analista_createdAt'],

                [Sequelize.col('IFI.ifiUsuario.usuario'), 'usuarioAreaInstructiva1'],
                [Sequelize.literal(`'INFORME FINAL'`), 'nombre_AI'],
                [Sequelize.col('IFI.documento_ifi'), 'documento_AI'],
                [Sequelize.col('IFI.createdAt'), 'AI_createdAt'],

                //Descargo IFI
                [Sequelize.col('IFI.DescargoIFIs.analista2Usuario.usuario'), 'usuarioAnalista2'],
                [Sequelize.literal(`'DESCARGO IFI'`), 'nombre_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.documento_DIFI'), 'documento_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.createdAt'), 'analista2_createdAt'],


                // //RESOLUCION SUBGERENCIAL///////////////////////
                // [Sequelize.col('IFI.RSG2.ResoSubUsuario.usuario'), 'usuarioResoSub'],
                // [Sequelize.literal(`'RESOLUCION SUBGERENCIAL'`), 'nombre_ResoSub'],
                // [Sequelize.col('IFI.RSG2.documento_RSG'), 'documento_ResoSub'],
                // [Sequelize.col('IFI.RSG2.createdAt'), 'ResoSub_createdAt'],

                //     //RECONSIDERACION SUBGERENCIAL/////////////////
                // [Sequelize.col('IFI.RSG2.Reconsideracion.RecursoReconUsuario.usuario'), 'usuarioReconsiSubg_Reconcideracion'],
                // [Sequelize.literal(`'RECURSO DE RECONSIDERACION'`), 'nombre_ReconsiSubg_Reconcideracion'],
                // [Sequelize.col('IFI.RSG2.Reconsideracion.documento'), 'documento_ReconsiSubg_Reconcideracion'],
                // [Sequelize.col('IFI.RSG2.Reconsideracion.createdAt'), 'ReconsiSubg_createdAt_Reconcideracion'],

                //         //SUBGERENCIA////////////////////
                // [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.rsgUsuario.usuario'), 'usuarioRSG_Reconcideracion'],
                // [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_RSG_Reconcideracion'],
                // [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.documento_RSG'), 'documento_RSG_Reconcideracion'],
                // [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.createdAt'), 'RSG_createdAt_Reconcideracion'],


                //RESOLUCION SANCIONADORA
                [Sequelize.col('IFI.RSG2.ResoSubUsuario.usuario'), 'usuarioResoSanc'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL'`), 'nombre_ResoSanc'],
                [Sequelize.col('IFI.RSG2.documento_RSG'), 'documento_ResoSanc'],
                [Sequelize.col('IFI.RSG2.createdAt'), 'ResoSanc_createdAt'],
                //RECONSIDERACION SUBGERENCIAL
                [Sequelize.col('IFI.RSG2.Reconsideracion.RecursoReconUsuario.usuario'), 'usuarioReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.literal(`'RECURSO DE RECONSIDERACION'`), 'nombre_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.documento'), 'documento_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.createdAt'), 'ReconsiSubg_createdAt_Reconcideracion_Sanc'],

                //SUBGERENCIA
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.rsgUsuario.usuario'), 'usuarioRSG_Reconcideracion_Sanc'],
                [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_RSG_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.documento_RSG'), 'documento_RSG_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.createdAt'), 'RSG_createdAt_Reconcideracion_Sanc'],



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
                            include: [
                                {
                                    model: RecursoReconsideracion,
                                    as: 'Reconsideracion',
                                    include: [
                                        {
                                            model: RSG,
                                            as: 'RSGs',
                                            include: [

                                                {
                                                    model: Usuario,
                                                    as: 'rsgUsuario',
                                                    attributes: []
                                                },
                                            ],
                                            attributes: []
                                        },
                                        {
                                            model: Usuario,
                                            as: 'RecursoReconUsuario',
                                            attributes: []
                                        }
                                    ],
                                    attributes: []
                                },
                                {
                                    model: ConstanciaInexigibilidad,
                                    as: 'inexiResoSub',
                                    attributes: []
                                },
                                {
                                    model: Usuario,
                                    as: 'ResoSubUsuario',
                                    attributes: []
                                }
                            ],
                            attributes: []
                        },
                        {
                            model: ResolucionSancionadora,
                            as: 'RSA',
                            include: [
                                {
                                    model: RecursoReconsideracion,
                                    as: 'Reconsideracion',
                                    // include: [
                                    //     {
                                    //         model: RSG,
                                    //         as: 'RSGs',
                                    //         include: [
                                    //             {
                                    //                 model: RecursoApelacion,
                                    //                 as: 'RecApelaciones',
                                    //                 include: [
                                    //                     {
                                    //                         model: RG,
                                    //                         as: 'RGs',
                                    //                         include: [
                                    //                             {
                                    //                                 model: ConstanciaInexigibilidad,
                                    //                                 as: 'inexiRG',
                                    //                                 include: [
                                    //                                     {
                                    //                                         model: Usuario,
                                    //                                         as: 'ConstInexiUsuario',
                                    //                                         attributes: []
                                    //                                     }
                                    //                                 ],
                                    //                                 attributes: []
                                    //                             },
                                    //                             {
                                    //                                 model: Usuario,
                                    //                                 as: 'rgUsuario',
                                    //                                 attributes: []
                                    //                             }
                                    //                         ],
                                    //                         attributes: []
                                    //                     },
                                    //                     {
                                    //                         model: Usuario,
                                    //                         as: 'RecApelacionUsuario',
                                    //                         attributes: []
                                    //                     }
                                    //                 ],
                                    //                 attributes: []
                                    //             },
                                    //             {
                                    //                 model: ConstanciaInexigibilidad,
                                    //                 as: 'InexiRSG',
                                    //                 attributes: []
                                    //             },
                                    //             {
                                    //                 model: Usuario,
                                    //                 as: 'rsgUsuario',
                                    //                 attributes: []
                                    //             },
                                    //         ],
                                    //         attributes: []
                                    //     },
                                    //     {
                                    //         model: Usuario,
                                    //         as: 'RecursoReconUsuario',
                                    //         attributes: []
                                    //     }
                                    // ],
                                    attributes: []
                                },
                                // {
                                //     model: RecursoApelacion,
                                //     as: 'Apelacion',
                                //     include: [
                                //         {
                                //             model: RG,
                                //             as: 'RGs',
                                //             include: [
                                //                 {
                                //                     model: ConstanciaInexigibilidad,
                                //                     as: 'inexiRG',
                                //                     include: [
                                //                         {
                                //                             model: Usuario,
                                //                             as: 'ConstInexiUsuario',
                                //                             attributes: []
                                //                         }
                                //                     ],
                                //                     attributes: []
                                //                 },
                                //                 {
                                //                     model: Usuario,
                                //                     as: 'rgUsuario',
                                //                     attributes: []
                                //                 }
                                //             ],
                                //             attributes: []
                                //         },
                                //         {
                                //             model: Usuario,
                                //             as: 'RecApelacionUsuario',
                                //             attributes: []
                                //         }
                                //     ],
                                //     attributes: []
                                // },
                                {
                                    model: ConstanciaInexigibilidad,
                                    as: 'inexResoSanc',
                                    attributes: []
                                },
                                {
                                    model: Usuario,
                                    as: 'resoSancUsuario',
                                    attributes: []
                                }
                            ],
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
            etapaInspector: row.get('usuarioInspector') ? {
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
            } : undefined,
            etapaDigitador: row.get('usuarioDigitador') ? {
                usuarioDigitador: row.get('usuarioDigitador'),
                digitador_createdAt: row.get('inspector_createdAt'),
            } : undefined,
            estapaDescargoNC: row.get('usuarioAnalista1') ? {
                usuarioAnalista1: row.get('usuarioAnalista1'),
                documento_descargoNC: {
                    nombre: row.get('nombre_descargoNC'),
                    path: row.get('documento_descargoNC')
                },
                analista_createdAt: row.get('analista_createdAt'),
            } : undefined,

            etapaAreaInstructiva: row.get('usuarioAreaInstructiva1') ? {
                usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
                documento_AI: {
                    nombre: row.get('nombre_AI'),
                    path: row.get('documento_AI'),
                },
                AI_createdAt: row.get('AI_createdAt'),
            } : undefined,

            etapaDescargoIFI: row.get('usuarioAnalista2') ? {
                usuarioAnalista2: row.get('usuarioAnalista2'),
                documento_descargoIFI: {
                    nombre: row.get('nombre_DIFI'),
                    path: row.get('documento_DIFI'),
                },
                analista2_createdAt: row.get('analista2_createdAt'),
            } : undefined,

            etapaResolucionSubgerencial: row.get('usuarioResoSub') ? {
                usuarioResoSub: row.get('usuarioResoSub'),
                documento_ResolucionSubgerencial: {
                    nombre: row.get('nombre_ResoSub'),
                    path: row.get('documento_ResoSub'),
                },
                ResoSub_createdAt: row.get('ResoSub_createdAt'),
            } : undefined,

            etapaRecursoReconsideracionSub: row.get('usuarioReconsiSubg_Reconcideracion') ? {
                usuarioReconsiSubg_Reconcideracion: row.get('usuarioReconsiSubg_Reconcideracion'),
                documento_RecursoReconsideracionSub: {
                    nombre: row.get('nombre_ReconsiSubg_Reconcideracion'),
                    path: row.get('documento_ReconsiSubg_Reconcideracion'),
                },
                ReconsiSubg_createdAt_Reconcideracion: row.get('ReconsiSubg_createdAt_Reconcideracion'),
            } : undefined,

            etapaRSGReconsideracionSub: row.get('usuarioRSG_Reconcideracion') ? {
                usuarioRSG_Reconcideracion: row.get('usuarioRSG_Reconcideracion'),
                documento_RSGReconsideracionSub: {
                    nombre: row.get('nombre_RSG_Reconcideracion'),
                    path: row.get('documento_RSG_Reconcideracion'),
                },
                ReconsiSubg_createdAt_Reconcideracion: row.get('RSG_createdAt_Reconcideracion'),
            } : undefined,
        }));


        return transformedData || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};

const getRSGforGerenciaController = async (id) => {
    try {
        const rgsnps = await RSG.findOne({
            where: { id: id },
            attributes: ['id', 'id_AR3', 'createdAt',

                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'analista4'],
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });
        return rgsnps || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};




const getRSGforAnalista4Controller = async (id) => {


    try {
        const rgsnps = await RSG.findOne({

            where: { id: id },
            attributes: ['id', 'id_AR3', 'createdAt',

                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'area_resolutiva3'],
            ],

            include: [
                {
                    model: NC,
                    as: 'NCs',
                    include: [
                        {
                            model: TramiteInspector,
                            as: 'tramiteInspector',
                            attributes: []
                        }
                    ],
                    attributes: []
                },
                {
                    model: Usuario,
                    as: 'Usuarios',
                    attributes: []
                },

            ],
        });
        return rgsnps || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};



const getAllRSGforPlataformaController = async () => {
    try {
        const response = await RSG.findAll({
            where: {
                id_recurso_apelacion: null,
                fecha_notificacion: { [Sequelize.Op.ne]: null },
                tipo: 'RSGNP',
            }
        });

        const formattedResponse = response.map(item => ({
            id: item.id,
            numero: item.nro_rsg,
            createdAt: item.createdAt,
            id_nc: item.id_nc,
            tipo_viene: 'RSG2'
        }));


        return formattedResponse || null;
    } catch (error) {
        return false
    }
}


const getAllRSGforSubgerenciaController = async () => {
    try {
        const response = await RecursoReconsideracion.findAll({
            where: Sequelize.where(Sequelize.col('RSGs.nro_rsg'), { [Sequelize.Op.ne]: null }),
            attributes: [
                'id',
                [Sequelize.col('RSGs.nro_rsg'), 'nro'],
                [Sequelize.col('RSGs.documento_RSG'), 'documento'],
                [Sequelize.col('RSGs.tipo'), 'tipo'],
                [Sequelize.col('RSGs.id_nc'), 'id_nc'],
                [Sequelize.literal(`
                    CASE 
                      WHEN "RSGs"."id_recurso_apelacion" = null THEN true
                      ELSE false
                    END
                  `), 'activo'],
                [Sequelize.col('RSGs.createdAt'), 'createdAt'],
                [Sequelize.literal(`
                    CASE 
                      WHEN "id_rsg" != "id_original" THEN false
                      ELSE true
                    END
                `), 'estado']
            ],
            include: [
                {
                    model: RSG,
                    as: 'RSGs',
                    attributes: []
                }
            ]
        })

        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
        return false;
    }
}

const getAllRSG3forAR3Controller = async () => {
    try {
        const response = await NC.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(col('IFI.RSG2.Reconsideracion.RSGs.tipo'), 'RSGP'),
                    Sequelize.where(col('IFI.RSA.Reconsideracion.RSGs.tipo'), 'RSGP')
                ]
            },
            order: [['createdAt', 'ASC']],
            attributes: [
                'id',
                //TRAMITE INSPECTOR
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
                            include: [
                                {
                                    model: RecursoReconsideracion,
                                    as: 'Reconsideracion',
                                    include: [
                                        {
                                            model: RSG,
                                            as: 'RSGs',
                                            include: [
                                                {
                                                    model: RecursoApelacion,
                                                    as: 'RecApelaciones',
                                                    include: [
                                                        {
                                                            model: RG,
                                                            as: 'RGs',
                                                            include: [
                                                                {
                                                                    model: ConstanciaInexigibilidad,
                                                                    as: 'inexiRG',
                                                                    include: [
                                                                        {
                                                                            model: Usuario,
                                                                            as: 'ConstInexiUsuario',
                                                                            attributes: []
                                                                        }
                                                                    ],
                                                                    attributes: []
                                                                },
                                                                {
                                                                    model: Usuario,
                                                                    as: 'rgUsuario',
                                                                    attributes: []
                                                                }
                                                            ],
                                                            attributes: []
                                                        },
                                                        {
                                                            model: Usuario,
                                                            as: 'RecApelacionUsuario',
                                                            attributes: []
                                                        }
                                                    ],
                                                    attributes: []
                                                },
                                                {
                                                    model: ConstanciaInexigibilidad,
                                                    as: 'InexiRSG',
                                                    attributes: []
                                                },
                                                {
                                                    model: Usuario,
                                                    as: 'rsgUsuario',
                                                    attributes: []
                                                },
                                            ],
                                            attributes: []
                                        },
                                        {
                                            model: Usuario,
                                            as: 'RecursoReconUsuario',
                                            attributes: []
                                        }
                                    ],
                                    attributes: []
                                },
                                {
                                    model: RecursoApelacion,
                                    as: 'Apelacion',
                                    include: [
                                        {
                                            model: RG,
                                            as: 'RGs',
                                            include: [
                                                {
                                                    model: ConstanciaInexigibilidad,
                                                    as: 'inexiRG',
                                                    include: [
                                                        {
                                                            model: Usuario,
                                                            as: 'ConstInexiUsuario',
                                                            attributes: []
                                                        }
                                                    ],
                                                    attributes: []
                                                },
                                                {
                                                    model: Usuario,
                                                    as: 'rgUsuario',
                                                    attributes: []
                                                }
                                            ],
                                            attributes: []
                                        },
                                        {
                                            model: Usuario,
                                            as: 'RecApelacionUsuario',
                                            attributes: []
                                        }
                                    ],
                                    attributes: []
                                },
                                {
                                    model: ConstanciaInexigibilidad,
                                    as: 'inexiResoSub',
                                    attributes: []
                                },
                                {
                                    model: Usuario,
                                    as: 'ResoSubUsuario',
                                    attributes: []
                                }
                            ],
                            attributes: []
                        },
                        {
                            model: ResolucionSancionadora,
                            as: 'RSA',
                            include: [
                                {
                                    model: RecursoReconsideracion,
                                    as: 'Reconsideracion',
                                    include: [
                                        {
                                            model: RSG,
                                            as: 'RSGs',
                                            include: [
                                                {
                                                    model: RecursoApelacion,
                                                    as: 'RecApelaciones',
                                                    include: [
                                                        {
                                                            model: RG,
                                                            as: 'RGs',
                                                            include: [
                                                                {
                                                                    model: ConstanciaInexigibilidad,
                                                                    as: 'inexiRG',
                                                                    include: [
                                                                        {
                                                                            model: Usuario,
                                                                            as: 'ConstInexiUsuario',
                                                                            attributes: []
                                                                        }
                                                                    ],
                                                                    attributes: []
                                                                },
                                                                {
                                                                    model: Usuario,
                                                                    as: 'rgUsuario',
                                                                    attributes: []
                                                                }
                                                            ],
                                                            attributes: []
                                                        },
                                                        {
                                                            model: Usuario,
                                                            as: 'RecApelacionUsuario',
                                                            attributes: []
                                                        }
                                                    ],
                                                    attributes: []
                                                },
                                                {
                                                    model: ConstanciaInexigibilidad,
                                                    as: 'InexiRSG',
                                                    attributes: []
                                                },
                                                {
                                                    model: Usuario,
                                                    as: 'rsgUsuario',
                                                    attributes: []
                                                },
                                            ],
                                            attributes: []
                                        },
                                        {
                                            model: Usuario,
                                            as: 'RecursoReconUsuario',
                                            attributes: []
                                        }
                                    ],
                                    attributes: []
                                },
                                {
                                    model: RecursoApelacion,
                                    as: 'Apelacion',
                                    include: [
                                        {
                                            model: RG,
                                            as: 'RGs',
                                            include: [
                                                {
                                                    model: ConstanciaInexigibilidad,
                                                    as: 'inexiRG',
                                                    include: [
                                                        {
                                                            model: Usuario,
                                                            as: 'ConstInexiUsuario',
                                                            attributes: []
                                                        }
                                                    ],
                                                    attributes: []
                                                },
                                                {
                                                    model: Usuario,
                                                    as: 'rgUsuario',
                                                    attributes: []
                                                }
                                            ],
                                            attributes: []
                                        },
                                        {
                                            model: Usuario,
                                            as: 'RecApelacionUsuario',
                                            attributes: []
                                        }
                                    ],
                                    attributes: []
                                },
                                {
                                    model: ConstanciaInexigibilidad,
                                    as: 'inexResoSanc',
                                    attributes: []
                                },
                                {
                                    model: Usuario,
                                    as: 'resoSancUsuario',
                                    attributes: []
                                }
                            ],
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


module.exports = {
    getRSGforAnalista4Controller,
    createRSGController,
    updateRsgnpController,
    getRsgnpController,
    getAllRsgnpController,
    getAllRSGNPforAN5Controller,
    getRSGController,
    getAllRSGforAnalista4Controller,
    updateRSGNPController,
    getAllRSGforGerenciaController,
    getAllRSGforAnalista5Controller,
    getAllRSG3forAR3Controller1,
    getAllRSG3forAR3Controller2,
    getRSGforGerenciaController,
    getRSGforAnalista5Controller,
    getAllRSGforPlataformaController,
    updateRSGController,
    getAllRSGforSubgerenciaController,
    getAllRSG3forAR3Controller
};
