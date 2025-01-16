const { TramiteInspector, NC, DescargoNC, IFI, RSG1, DescargoIFI, RSG2, RSA, DescargoRSA, RSG, DescargoRSG, RG, Usuario, Acta, RecursoReconsideracion,
    ResolucionSubgerencial, RecursoApelacion, CargoNotificacion, ResolucionSancionadora, ConstanciaInexigibilidad } = require('../../../config/db_connection');
const { Sequelize } = require('sequelize');

const getAllNCSeguimientoController = async () => {
    try {
        const response = await NC.findAll({
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

                //                  IFI
                [Sequelize.col('IFI.ifiUsuario.usuario'), 'usuarioAreaInstructiva1'],
                [Sequelize.literal(`'INFORME FINAL'`), 'nombre_AI'],
                [Sequelize.col('IFI.documento_ifi'), 'documento_AI'],
                [Sequelize.col('IFI.createdAt'), 'AI_createdAt'],

                //                  Descargo IFI
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

                //APELACION SUBGERENCIAL////////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RecApelacionUsuario.usuario'), 'usuarioApelacionSubg_Reconcideracion'],
                [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_ApelacionSubg_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.documento'), 'documento_ApelacionSubg_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.createdAt'), 'ApelacionSubg_createdAt_Reconcideracion'],

                //GERENCIA///////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.rgUsuario.usuario'), 'usuarioGerencia_Reconcideracion'],
                [Sequelize.literal(`'GERENCIA'`), 'nombre_Gerencia_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.documento_rg'), 'documento_Gerencia_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.createdAt'), 'Gerencia_createdAt_Reconcideracion'],

                //CONSTANCIA INEXIGILIDAD///////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.ConstInexiUsuario.usuario'), 'usuarioConstInexigibilidad_Reconcideracion'],
                [Sequelize.literal(`'CONSTANCIA DE INEXIGIBILIDAD'`), 'nombre_ConstInexigibilidad_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.documento_ci'), 'documento_ConstInexigibilidad_Reconcideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.createdAt'), 'ConstInexigibilidad_createdAt_Reconcideracion'],

                //APELACION SUBGERENCIAL///////////////
                [Sequelize.col('IFI.RSG2.Apelacion.RecApelacionUsuario.usuario'), 'usuarioApelacionSubg_Apelacion'],
                [Sequelize.literal(`'RECURSO DE APELACION'`), 'nombre_ApelacionSubg_Apelacion'],
                [Sequelize.col('IFI.RSG2.Apelacion.documento'), 'documento_ApelacionSubg_Apelacion'],
                [Sequelize.col('IFI.RSG2.Apelacion.createdAt'), 'ApelacionSubg_createdAt_Apelacion'],

                //GERENCIA///////////
                [Sequelize.col('IFI.RSG2.Apelacion.RGs.rgUsuario.usuario'), 'usuarioGerencia_Apelacion'],
                [Sequelize.literal(`'GERENCIA'`), 'nombre_Gerencia_Apelacion'],
                [Sequelize.col('IFI.RSG2.Apelacion.RGs.documento_rg'), 'documento_Gerencia_Apelacion'],
                [Sequelize.col('IFI.RSG2.Apelacion.RGs.createdAt'), 'Gerencia_createdAt_Apelacion'],

                //CONSTANCIA INEXIGILIDAD
                [Sequelize.col('IFI.RSG2.Apelacion.RGs.inexiRG.ConstInexiUsuario.usuario'), 'usuarioConstInexigibilidad_Apelacion'],
                [Sequelize.literal(`'CONSTANCIA DE INEXIGIBILIDAD'`), 'nombre_ConstInexigibilidad_Apelacion'],
                [Sequelize.col('IFI.RSG2.Apelacion.RGs.inexiRG.documento_ci'), 'documento_ConstInexigibilidad_Apelacion'],
                [Sequelize.col('IFI.RSG2.Apelacion.RGs.inexiRG.createdAt'), 'ConstInexigibilidad_createdAt_Apelacion'],




                //-------------------------------------------------------------------



                //RESOLUCION SANCIONADORA
                [Sequelize.col('IFI.RSA.resoSancUsuario.usuario'), 'usuarioResoSanc'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL'`), 'nombre_ResoSanc'],
                [Sequelize.col('IFI.RSA.documento_RSA'), 'documento_ResoSanc'],
                [Sequelize.col('IFI.RSA.createdAt'), 'ResoSanc_createdAt'],
                //RECONSIDERACION SUBGERENCIAL
                [Sequelize.col('IFI.RSA.Reconsideracion.RecursoReconUsuario.usuario'), 'usuarioReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.literal(`'RECURSO DE RECONSIDERACION'`), 'nombre_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.documento'), 'documento_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.createdAt'), 'ReconsiSubg_createdAt_Reconcideracion_Sanc'],

                //SUBGERENCIA
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.rsgUsuario.usuario'), 'usuarioRSG_Reconcideracion_Sanc'],
                [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_RSG_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.documento_RSG'), 'documento_RSG_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.createdAt'), 'RSG_createdAt_Reconcideracion_Sanc'],

                //APELACION SUBGERENCIAL
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RecApelacionUsuario.usuario'), 'usuarioApelacionSubg_Reconcideracion_Sanc'],
                [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_ApelacionSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.documento'), 'documento_ApelacionSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.createdAt'), 'ApelacionSubg_createdAt_Reconcideracion_Sanc'],

                //GERENCIA
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.rgUsuario.usuario'), 'usuarioGerencia_Reconcideracion_Sanc'],
                [Sequelize.literal(`'GERENCIA'`), 'nombre_Gerencia_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.documento_rg'), 'documento_Gerencia_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.createdAt'), 'Gerencia_createdAt_Reconcideracion_Sanc'],

                //CONSTANCIA INEXIGILIDAD
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.ConstInexiUsuario.usuario'), 'usuarioConstInexigibilidad_Reconcideracion_Sanc'],
                [Sequelize.literal(`'CONSTANCIA DE INEXIGIBILIDAD'`), 'nombre_ConstInexigibilidad_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.documento_ci'), 'documento_ConstInexigibilidad_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.createdAt'), 'ConstInexigibilidad_createdAt_Reconcideracion_Sanc'],

                //APELACION SUBGERENCIAL
                [Sequelize.col('IFI.RSA.Apelacion.RecApelacionUsuario.usuario'), 'usuarioApelacionSubg_Apelacion_Sanc'],
                [Sequelize.literal(`'RECURSO DE APELACION'`), 'nombre_ApelacionSubg_Apelacion_Sanc'],
                [Sequelize.col('IFI.RSA.Apelacion.documento'), 'documento_ApelacionSubg_Apelacion_Sanc'],
                [Sequelize.col('IFI.RSA.Apelacion.createdAt'), 'ApelacionSubg_createdAt_Apelacion_Sanc'],

                //GERENCIA
                [Sequelize.col('IFI.RSA.Apelacion.RGs.rgUsuario.usuario'), 'usuarioGerencia_Apelacion_Sanc'],
                [Sequelize.literal(`'GERENCIA'`), 'nombre_Gerencia_Apelacion_Sanc'],
                [Sequelize.col('IFI.RSA.Apelacion.RGs.documento_rg'), 'documento_Gerencia_Apelacion_Sanc'],
                [Sequelize.col('IFI.RSA.Apelacion.RGs.createdAt'), 'Gerencia_createdAt_Apelacion_Sanc'],

                //CONSTANCIA INEXIGILIDAD
                [Sequelize.col('IFI.RSA.Apelacion.RGs.inexiRG.ConstInexiUsuario.usuario'), 'usuarioConstInexigibilidad_Apelacion_Sanc'],
                [Sequelize.literal(`'CONSTANCIA DE INEXIGIBILIDAD'`), 'nombre_ConstInexigibilidad_Apelacion_Sanc'],
                [Sequelize.col('IFI.RSA.Apelacion.RGs.inexiRG.documento_ci'), 'documento_ConstInexigibilidad_Apelacion_Sanc'],
                [Sequelize.col('IFI.RSA.Apelacion.RGs.inexiRG.createdAt'), 'ConstInexigibilidad_createdAt_Apelacion_Sanc'],





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
            listData: [
                row.get('usuarioInspector') ? {

                    name: "inspector",
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

                row.get('usuarioDigitador') ? {
                    name: 'digitador',
                    usuarioDigitador: row.get('usuarioDigitador'),
                    digitador_createdAt: row.get('inspector_createdAt'),
                } : undefined,

                row.get('usuarioAnalista1') ? {
                    name: 'Descargo NC',
                    usuarioAnalista1: row.get('usuarioAnalista1'),
                    documento_descargoNC: {
                        nombre: row.get('nombre_descargoNC'),
                        path: row.get('documento_descargoNC')
                    },
                    analista_createdAt: row.get('analista_createdAt'),
                } : undefined,

                row.get('usuarioAreaInstructiva1') ? {
                    name: 'Informe Final',
                    usuarioAreaInstructiva1: row.get('usuarioAreaInstructiva1'),
                    documento_AI: {
                        nombre: row.get('nombre_AI'),
                        path: row.get('documento_AI'),
                    },
                    AI_createdAt: row.get('AI_createdAt'),
                } : undefined,

                row.get('usuarioAnalista2') ? {
                    name: 'Descargo IFI',
                    usuarioAnalista2: row.get('usuarioAnalista2'),
                    documento_descargoIFI: {
                        nombre: row.get('nombre_DIFI'),
                        path: row.get('documento_DIFI'),
                    },
                    analista2_createdAt: row.get('analista2_createdAt'),
                } : undefined,

                row.get('usuarioResoSub') ? {
                    name: 'Resolucion Subgerencial',
                    usuarioResoSub: row.get('usuarioResoSub'),
                    documento_ResolucionSubgerencial: {
                        nombre: row.get('nombre_ResoSub'),
                        path: row.get('documento_ResoSub'),
                    },
                    ResoSub_createdAt: row.get('ResoSub_createdAt'),
                } : undefined,

                row.get('usuarioReconsiSubg_Reconcideracion') ? {
                    name: 'Recurso de Reconsideración',
                    usuarioReconsiSubg_Reconcideracion: row.get('usuarioReconsiSubg_Reconcideracion'),
                    documento_RecursoReconsideracionSub: {
                        nombre: row.get('nombre_ReconsiSubg_Reconcideracion'),
                        path: row.get('documento_ReconsiSubg_Reconcideracion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('ReconsiSubg_createdAt_Reconcideracion'),
                } : undefined,

                row.get('usuarioRSG_Reconcideracion') ? {
                    name: 'Subgerencia',
                    usuarioRSG_Reconcideracion: row.get('usuarioRSG_Reconcideracion'),
                    documento_RSGReconsideracionSub: {
                        nombre: row.get('nombre_RSG_Reconcideracion'),
                        path: row.get('documento_RSG_Reconcideracion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('RSG_createdAt_Reconcideracion'),
                } : undefined,

                row.get('usuarioApelacionSubg_Reconcideracion') ? {
                    name: 'Recurso de Apelacion',
                    usuarioApelacionSubg_Reconcideracion: row.get('usuarioApelacionSubg_Reconcideracion'),
                    documento_RecursoApelacionSub: {
                        nombre: row.get('nombre_ApelacionSubg_Reconcideracion'),
                        path: row.get('documento_ApelacionSubg_Reconcideracion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('ApelacionSubg_createdAt_Reconcideracion'),
                } : undefined,

                row.get('usuarioGerencia_Reconcideracion') ? {
                    name: 'Gerencia',
                    usuarioGerencia_Reconcideracion: row.get('usuarioGerencia_Reconcideracion'),
                    documento_GerenciaSub: {
                        nombre: row.get('nombre_Gerencia_Reconcideracion'),
                        path: row.get('documento_Gerencia_Reconcideracion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('Gerencia_createdAt_Reconcideracion'),
                } : undefined,

                row.get('usuarioConstInexigibilidad_Reconcideracion') ? {
                    name: 'Constancia de Inexigibilidad',
                    usuarioConstInexigibilidad_Reconcideracion: row.get('usuarioConstInexigibilidad_Reconcideracion'),
                    documento_InexigibilidadSub: {
                        nombre: row.get('nombre_ConstInexigibilidad_Reconcideracion'),
                        path: row.get('documento_ConstInexigibilidad_Reconcideracion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('ConstInexigibilidad_createdAt_Reconcideracion'),
                } : undefined,

                row.get('usuarioApelacionSubg_Apelacion') ? {
                    name: 'Recurso de Apelacion',
                    usuarioApelacionSubg_Apelacion: row.get('usuarioApelacionSubg_Apelacion'),
                    documento_RecursoApelacionSub2: {
                        nombre: row.get('nombre_ApelacionSubg_Apelacion'),
                        path: row.get('documento_ApelacionSubg_Apelacion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('ApelacionSubg_createdAt_Apelacion'),
                } : undefined,

                row.get('usuarioGerencia_Apelacion') ? {
                    name: 'Gerencia',
                    usuarioGerencia_Apelacion: row.get('usuarioGerencia_Apelacion'),
                    documento_GerenciaSub2: {
                        nombre: row.get('nombre_Gerencia_Apelacion'),
                        path: row.get('documento_Gerencia_Apelacion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('Gerencia_createdAt_Apelacion'),
                } : undefined,

                row.get('usuarioConstInexigibilidad_Apelacion') ? {
                    name: 'Constancia de Inexigibilidad',
                    usuarioConstInexigibilidad_Apelacion: row.get('usuarioConstInexigibilidad_Apelacion'),
                    documento_ConstInexigibilidad2: {
                        nombre: row.get('nombre_ConstInexigibilidad_Apelacion'),
                        path: row.get('documento_ConstInexigibilidad_Apelacion'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('ConstInexigibilidad_createdAt_Apelacion'),
                } : undefined,

                row.get('usuarioResoSanc') ? {
                    name: 'Resolucion Sancionadora',
                    usuarioResoSanc: row.get('usuarioResoSanc'),
                    documento_ResolucionSancionadora: {
                        nombre: row.get('nombre_ResoSanc'),
                        path: row.get('documento_ResoSanc'),
                    },
                    ResoSanc_createdAt: row.get('ResoSanc_createdAt'),
                } : undefined,

                row.get('usuarioReconsiSubg_Reconcideracion_Sanc') ? {
                    name: 'Recurso de Reconsideracion',
                    usuarioReconsiSubg_Reconcideracion_Sanc: row.get('usuarioReconsiSubg_Reconcideracion_Sanc'),
                    documento_RecursoReconsideracionSanc: {
                        nombre: row.get('nombre_ReconsiSubg_Reconcideracion_Sanc'),
                        path: row.get('documento_ReconsiSubg_Reconcideracion_Sanc'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion_Sanc: row.get('ReconsiSubg_createdAt_Reconcideracion_Sanc'),
                } : undefined,

                row.get('usuarioRSG_Reconcideracion_Sanc') ? {
                    name: 'Subgerencia',
                    usuarioRSG_Reconcideracion_Sanc: row.get('usuarioRSG_Reconcideracion_Sanc'),
                    documento_RSGReconsideracionSanc: {
                        nombre: row.get('nombre_RSG_Reconcideracion_Sanc'),
                        path: row.get('documento_RSG_Reconcideracion_Sanc'),
                    },
                    RSG_createdAt_Reconcideracion_Sanc: row.get('RSG_createdAt_Reconcideracion_Sanc'),
                } : undefined,

                row.get('usuarioApelacionSubg_Reconcideracion_Sanc') ? {
                    name: 'Recurso de Apelación',
                    usuarioApelacionSubg_Reconcideracion_Sanc: row.get('usuarioApelacionSubg_Reconcideracion_Sanc'),
                    documento_RecursoApelacionSanc: {
                        nombre: row.get('nombre_ApelacionSubg_Reconcideracion_Sanc'),
                        path: row.get('documento_ApelacionSubg_Reconcideracion_Sanc'),
                    },
                    ApelacionSubg_createdAt_Reconcideracion_Sanc: row.get('ApelacionSubg_createdAt_Reconcideracion_Sanc'),
                } : undefined,

                row.get('usuarioGerencia_Reconcideracion_Sanc') ? {
                    name: 'Gerencia',
                    usuarioGerencia_Reconcideracion_Sanc: row.get('usuarioGerencia_Reconcideracion_Sanc'),
                    documento_GerenciaSanc: {
                        nombre: row.get('nombre_Gerencia_Reconcideracion_Sanc'),
                        path: row.get('documento_Gerencia_Reconcideracion_Sanc'),
                    },
                    Gerencia_createdAt_Reconcideracion_Sanc: row.get('Gerencia_createdAt_Reconcideracion_Sanc'),
                } : undefined,

                row.get('usuarioConstInexigibilidad_Reconcideracion_Sanc') ? {
                    name: 'Constancia de Inexigibilidad',
                    usuarioConstInexigibilidad_Reconcideracion_Sanc: row.get('usuarioConstInexigibilidad_Reconcideracion_Sanc'),
                    documento_InexigibilidadSanc: {
                        nombre: row.get('nombre_ConstInexigibilidad_Reconcideracion_Sanc'),
                        path: row.get('documento_ConstInexigibilidad_Reconcideracion_Sanc'),
                    },
                    ConstInexigibilidad_createdAt_Reconcideracion_Sanc: row.get('ConstInexigibilidad_createdAt_Reconcideracion_Sanc'),
                } : undefined,

                row.get('usuarioApelacionSubg_Apelacion_Sanc') ? {
                    name: 'Recurso de Apelacion',
                    usuarioApelacionSubg_Apelacion_Sanc: row.get('usuarioApelacionSubg_Apelacion_Sanc'),
                    documento_RecursoApelacionSub2_Sanc: {
                        nombre: row.get('nombre_ApelacionSubg_Apelacion_Sanc'),
                        path: row.get('documento_ApelacionSubg_Apelacion_Sanc'),
                    },
                    ApelacionSubg_createdAt_Apelacion_Sanc: row.get('ApelacionSubg_createdAt_Apelacion_Sanc'),
                } : undefined,

                row.get('usuarioGerencia_Apelacion_Sanc') ? {
                    name: 'Gerencia',
                    usuarioGerencia_Apelacion_Sanc: row.get('usuarioGerencia_Apelacion_Sanc'),
                    documento_GerenciaSub2_Sanc: {
                        nombre: row.get('nombre_Gerencia_Apelacion_Sanc'),
                        path: row.get('documento_Gerencia_Apelacion_Sanc'),
                    },
                    ReconsiSubg_createdAt_Reconcideracion: row.get('Gerencia_createdAt_Apelacion_Sanc'),
                } : undefined,

                row.get('usuarioConstInexigibilidad_Apelacion_Sanc') ? {
                    name: 'Constancia de Inexigibilidad',
                    usuarioConstInexigibilidad_Apelacion_Sanc: row.get('usuarioConstInexigibilidad_Apelacion_Sanc'),
                    documento_ConstInexigibilidad2_Sanc: {
                        nombre: row.get('nombre_ConstInexigibilidad_Apelacion_Sanc'),
                        path: row.get('documento_ConstInexigibilidad_Apelacion_Sanc'),
                    },
                    ConstInexigibilidad_createdAt_Apelacion_Sanc: row.get('ConstInexigibilidad_createdAt_Apelacion_Sanc'),
                } : undefined,

            ].filter(Boolean),

        }));


        return transformedData || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};

module.exports = {
    getAllNCSeguimientoController
};
