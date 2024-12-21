const { RG, Usuario,  NC , TramiteInspector } = require('../db_connection'); 
const { Sequelize } = require('sequelize');
const { RSG1, DescargoNC, DescargoRSG, IFI, DescargoIFI, RSG2, RSA, DescargoRSA, RSG, Acta } = require('../db_connection'); 

const getAllDataController = async () => {
    try {
        const response = await NC.findAll({ 
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

                //primera muerte
                [Sequelize.col('IFI.TERMINADO_RSG1.Usuarios.usuario'), 'usuarioRSG1'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL 1'`), 'nombre_RSG1'],
                [Sequelize.col('IFI.TERMINADO_RSG1.documento'), 'documento_RSG1'],
                [Sequelize.col('IFI.TERMINADO_RSG1.createdAt'), 'RSG1_createdAt'],

                [Sequelize.col('IFI.DescargoIFIs.analista2Usuario.usuario'), 'usuarioAnalista2'],
                [Sequelize.literal(`'DESCARGO IFI'`), 'nombre_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.documento_DIFI'), 'documento_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.createdAt'), 'analista2_createdAt'],

                //primera muerte
                [Sequelize.col('IFI.RSG2.Usuarios.usuario'), 'usuarioAreaInstructiva2'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL 2'`), 'nombre_AR2'],
                [Sequelize.col('IFI.RSG2.documento'), 'documento_AR2'],
                [Sequelize.col('IFI.RSG2.createdAt'), 'AR2_createdAt'],

                [Sequelize.col('IFI.RSA.Usuarios.usuario'), 'usuarioAreaInstructiva2'],
                [Sequelize.literal(`'RESOLUCION SANCIONADORA ADMINISTRATIVA'`), 'nombre_RSA'],
                [Sequelize.col('IFI.RSA.documento_RSA'), 'documento_RSA'],
                [Sequelize.col('IFI.RSA.createdAt'), 'RSA_createdAt'],

                [Sequelize.col('IFI.RSA.DescargoRSAs.Usuarios.usuario'), 'usuarioAnalista3'],
                [Sequelize.literal(`'DESCARGO RSA'`), 'nombre_DRSA'],
                [Sequelize.col('IFI.RSA.DescargoRSAs.documento_DRSA'), 'documento_DRSA'],
                [Sequelize.col('IFI.RSA.DescargoRSAs.createdAt'), 'DRSA_createdAt'],

                [Sequelize.col('IFI.RSA.RSGs.Usuarios.usuario'), 'usuarioAreaInstructiva3'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL GENERAL 3'`), 'nombre_RSG3'],
                [Sequelize.col('IFI.RSA.RSGs.documento_RSG'), 'documento_RSG'],
                [Sequelize.col('IFI.RSA.RSGs.createdAt'), 'RSG3_createdAt'],

                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.Usuarios.usuario'), 'usuarioAnalista4'],
                [Sequelize.literal(`'DESCARGO RSG'`), 'nombre_DRSG'],
                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.documento_DRSG'), 'documento_DRSG'],
                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.createdAt'), 'DRSG_createdAt'],

                [Sequelize.col('IFI.RSA.RSGs.RGs.Usuarios.usuario'), 'usuarioGerencia'],
                [Sequelize.literal(`'RESOLUCION GENERAL PROCEDENTE'`), 'nombre_RG'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.documento_rg'), 'documento_RG'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.createdAt'), 'RG_createdAt'],

                [Sequelize.col('IFI.RSA.RSGs.RGs.ActaGerente.analista5Usuario.usuario'), 'usuarioAnalista5'],
                [Sequelize.literal(`'ACTA DE CONSENTIMIENTO'`), 'nombre_Acta'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.ActaGerente.documento_acta'), 'documento_Acta'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.ActaGerente.createdAt'), 'Acta_createdAt'],

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
                            model: RSG1,
                            as: 'TERMINADO_RSG1',
                            include: [
                                {
                                    model: Usuario,
                                    as: 'Usuarios',
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
                            model: RSA,
                            as: 'RSA',
                            include: [
                                {
                                    model: Usuario,
                                    as: 'Usuarios',
                                },
                                {
                                    model:  DescargoRSA,
                                    as: 'DescargoRSAs',
                                    include: [
                                        {
                                            model: Usuario,
                                            as: 'Usuarios',
                                        }
                                    ]
                                },
                                {
                                    model:  Acta,
                                    as: 'ActaRsa',
                                    include: [
                                        {
                                            model: Usuario,
                                            as: 'analista5Usuario',
                                        }
                                    ]
                                },
                                {
                                    model:  RSG,
                                    as: 'RSGs',
                                    include: [
                                        {
                                            model:  DescargoRSG,
                                            as: 'DescargoRSGs',
                                            include: [
                                                {
                                                    model: Usuario,
                                                    as: 'Usuarios',
                                                }
                                            ]
                                        },
                                        {
                                            model:  Acta,
                                            as: 'ActaRSG',
                                            include: [
                                                {
                                                    model: Usuario,
                                                    as: 'analista5Usuario',
                                                }
                                            ]
                                        },      
                                        {
                                            model: Usuario,
                                            as: 'Usuarios',
                                        },
                                        {
                                            model: RG,
                                            as: 'RGs',
                                            include: [
                                                {
                                                    model: Usuario,
                                                    as: 'Usuarios',
                                                },
                                                {
                                                    model:  Acta,
                                                    as: 'ActaGerente',
                                                    include: [
                                                        {
                                                            model: Usuario,
                                                            as: 'analista5Usuario',
                                                        }
                                                    ]
                                                },
                                            ]
                                        }
                                    ]
                                }
                            ],
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
            etapaRSA: row.get('usuarioAreaInstructiva2') ? {
                usuarioAreaInstructiva2: row.get('usuarioAreaInstructiva2'),
                documento_RSA: {
                    nombre: row.get('nombre_RSA'),
                    path: row.get('documento_RSA'),
                },
                AR2_createdAt: row.get('RSA_createdAt'),
            } : undefined,
            etapaDescargoRSA: row.get('usuarioAnalista3') ? {
                usuarioAnalista3: row.get('usuarioAnalista3'),
                documento_DRSA: {
                    nombre: row.get('nombre_DRSA'),
                    path: row.get('documento_DRSA'),
                },
                analista3_createdAt: row.get('DRSA_createdAt'),
            } : undefined,
            etapaRSG: row.get('usuarioAreaInstructiva3') ? {
                usuarioAreaInstructiva3: row.get('usuarioAreaInstructiva3'),
                documento_RSG: {
                    nombre: row.get('nombre_RSG3'),
                    path: row.get('documento_RSG'),
                },
                AR3_createdAt: row.get('RSG3_createdAt'),
            } : undefined,
            etapaDescargoRSG: row.get('usuarioAnalista4') ? {
                usuarioAnalista4: row.get('usuarioAnalista4'),
                documento_DRSG: {
                    nombre: row.get('nombre_DRSG'),
                    path: row.get('documento_DRSG'),
                },
                analista4_createdAt: row.get('DRSG_createdAt'),
            } : undefined,
            etapaRG: row.get('usuarioGerencia') ? {
                usuarioGerencia: row.get('usuarioGerencia'),
                documento_RG: {
                    nombre: row.get('nombre_RG'),
                    path: row.get('documento_RG'),
                },
                analista4_createdAt: row.get('RG_createdAt'),
            } : undefined,
            etapaConsentimiento: row.get('usuarioAnalista5') ? {
                usuarioAnalista5: row.get('usuarioAnalista5'),
                documento_Acta: {
                    nombre: row.get('nombre_Acta'),
                    path: row.get('documento_Acta'),
                },
                analista5_createdAt: row.get('Acta_createdAt'),
            } : undefined
            
        }));


        return transformedData || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};

module.exports = {
    getAllDataController
};
