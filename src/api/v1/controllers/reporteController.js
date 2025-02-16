const { RG, Usuario, NC, TramiteInspector, Infraccion, MedidaComplementaria } = require('../../../config/db_connection');
const { Sequelize } = require('sequelize');
const { RSG1, DescargoNC, DescargoRSG, IFI, Entidad, DescargoIFI, ResolucionSancionadora, RSG2, RSA, DescargoRSA, ConstanciaInexigibilidad, RecursoApelacion, RSG, Acta, ResolucionSubgerencial, RecursoReconsideracion } = require('../../../config/db_connection');
const { Op } = require("sequelize");

const getAllDataController = async (page = 1, limit = 20, ordenanza = null, actividad_economica = null, fecha_NC = null) => {
    const offset = page == 0 ? null : (page - 1) * limit;
    limit = page == 0 ? null : limit;

    let whereCondition = {
        '$tramiteInspector.nro_nc$': { [Sequelize.Op.ne]: null },
        ...(ordenanza && { ordenanza_municipal: { [Op.iLike]: `%${ordenanza}%` } }),
        ...(actividad_economica && {
            '$entidad.giro_entidad$': { [Op.iLike]: `%${actividad_economica}%` }
        })
    };

    if (fecha_NC) {
        let fechaStart = new Date(fecha_NC.start);
        let fechaEnd = new Date(fecha_NC.end);

        fechaStart.setUTCHours(0, 0, 0, 0);
        fechaEnd.setUTCHours(23, 59, 59, 999);

        whereCondition = {
            ...whereCondition,
            '$tramiteInspector.createdAt$': {
                [Op.between]: [fechaStart, fechaEnd]
            }
        };
    }

    try {
        const response = await NC.findAndCountAll({
            where: whereCondition,
            order: [['createdAt', 'ASC']],
            limit,
            offset,
            attributes: [
                'id',
                'ordenanza_municipal',
                [Sequelize.col('entidad.nombre_entidad'), 'razon_social'],
                'nro_documento',
                [Sequelize.col('tramiteInspector.nro_nc'), 'numero_nc'],
                [Sequelize.col('tramiteInspector.nro_acta'), 'numero_acta'],
                [Sequelize.col('tramiteInspector.createdAt'), 'fecha_NC'],
                'lugar_infraccion',
                [Sequelize.col('entidad.giro_entidad'), 'giro'],
                [Sequelize.col('infraccion.codigo'), 'codigo'],
                [Sequelize.col('infraccion.descripcion'), 'descripcion'],
                [Sequelize.col('infraccion.tipo'), 'tipo_infraccion'],

                [Sequelize.col('infraccion.monto'), 'monto'],

                'observaciones',
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'usuarioInspector'],


                // //                 //DIGITADOR
                // [Sequelize.col('digitadorUsuario.usuario'), 'usuarioDigitador'],

                // //                 //DESCARGO NC
                [Sequelize.col('descargoNC.nro_descargo'), 'numero_descargoNC'],
                [Sequelize.col('descargoNC.createdAt'), 'fecha_descargoNC'],

                // //                  IFI
                [Sequelize.col('IFI.nro_ifi'), 'numero_IFI'],
                [Sequelize.col('IFI.createdAt'), 'fecha_IFI'],
                [Sequelize.col('IFI.fecha_notificacion'), 'fecha_notificacion_IFI'],

                // //                  Descargo IFI
                [Sequelize.col('IFI.DescargoIFIs.nro_descargo'), 'numero_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.createdAt'), 'fecha_descargo'],


                // //RESOLUCION SUBGERENCIAL///////////////////////
                [Sequelize.col('IFI.RSG2.nro_rsg'), 'numero_RSG1'],
                [Sequelize.col('IFI.RSG2.createdAt'), 'fecha_RSG1'],
                [Sequelize.col('IFI.RSG2.fecha_notificacion_rsg'), 'fecha_notificacion_RSG1'],


                // //RECONSIDERACION SUBGERENCIAL/////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.nro_recurso'), 'numero_reconsideracion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.fecha_recurso'), 'fecha_reconsideracion'],

                // //SUBGERENCIA////////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.nro_rsg'), 'fecha_RSG2'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.fecha_rsg'), 'numero_RSG2'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.fecha_notificacion'), 'fecha_notificacion_RSG2'],

                // //APELACION SUBGERENCIAL////////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.nro_recurso'), 'numero_apelacion'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.fecha_recurso'), 'fecha_apelacion'],

                // //GERENCIA///////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.nro_rg'), 'fecha_RG'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.fecha_rg'), 'numero_RG'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.fecha_notificacion'), 'fecha_notificacion_RG'],

                // //CONSTANCIA INEXIGILIDAD///////////////////
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.nro_ci'), 'numero_constancia_exigibilidad'],
                [Sequelize.col('IFI.RSG2.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.fecha_ci'), 'fecha_constancia_Exigibilidad'],

                // //APELACION SUBGERENCIAL///////////////
                // [Sequelize.col('IFI.RSG2.Apelacion.RecApelacionUsuario.usuario'), 'usuarioApelacionSubg_Apelacion'],
                // [Sequelize.literal(`'RECURSO DE APELACION'`), 'nombre_ApelacionSubg_Apelacion'],
                // [Sequelize.col('IFI.RSG2.Apelacion.documento'), 'documento_ApelacionSubg_Apelacion'],
                // [Sequelize.col('IFI.RSG2.Apelacion.createdAt'), 'ApelacionSubg_createdAt_Apelacion'],

                // //GERENCIA///////////
                // [Sequelize.col('IFI.RSG2.Apelacion.RGs.rgUsuario.usuario'), 'usuarioGerencia_Apelacion'],
                // [Sequelize.literal(`'GERENCIA'`), 'nombre_Gerencia_Apelacion'],
                // [Sequelize.col('IFI.RSG2.Apelacion.RGs.documento_rg'), 'documento_Gerencia_Apelacion'],
                // [Sequelize.col('IFI.RSG2.Apelacion.RGs.createdAt'), 'Gerencia_createdAt_Apelacion'],

                // //CONSTANCIA INEXIGILIDAD
                // [Sequelize.col('IFI.RSG2.Apelacion.RGs.inexiRG.ConstInexiUsuario.usuario'), 'usuarioConstInexigibilidad_Apelacion'],
                // [Sequelize.literal(`'CONSTANCIA DE INEXIGIBILIDAD'`), 'nombre_ConstInexigibilidad_Apelacion'],
                // [Sequelize.col('IFI.RSG2.Apelacion.RGs.inexiRG.documento_ci'), 'documento_ConstInexigibilidad_Apelacion'],
                // [Sequelize.col('IFI.RSG2.Apelacion.RGs.inexiRG.createdAt'), 'ConstInexigibilidad_createdAt_Apelacion'],




                // //-------------------------------------------------------------------



                // //RESOLUCION SANCIONADORA
                [Sequelize.col('IFI.RSA.nro_rsa'), 'numero_RSA'],
                [Sequelize.col('IFI.RSA.createdAt'), 'fecha_RSA'],
                [Sequelize.col('IFI.RSA.createdAt'), 'fecha_notificacion_RSA'],

                //RECONSIDERACION SUBGERENCIAL
                [Sequelize.col('IFI.RSA.Reconsideracion.RecursoReconUsuario.usuario'), 'usuarioReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.literal(`'RECURSO DE RECONSIDERACION'`), 'nombre_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.documento'), 'documento_ReconsiSubg_Reconcideracion_Sanc'],
                [Sequelize.col('IFI.RSA.Reconsideracion.createdAt'), 'ReconsiSubg_createdAt_Reconcideracion_Sanc'],

                // //SUBGERENCIA
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.rsgUsuario.usuario'), 'usuarioRSG_Reconcideracion_Sanc'],
                // [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_RSG_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.documento_RSG'), 'documento_RSG_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.createdAt'), 'RSG_createdAt_Reconcideracion_Sanc'],

                // //APELACION SUBGERENCIAL
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RecApelacionUsuario.usuario'), 'usuarioApelacionSubg_Reconcideracion_Sanc'],
                // [Sequelize.literal(`'SUBGERENCIA'`), 'nombre_ApelacionSubg_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.documento'), 'documento_ApelacionSubg_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.createdAt'), 'ApelacionSubg_createdAt_Reconcideracion_Sanc'],

                // //GERENCIA
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.rgUsuario.usuario'), 'usuarioGerencia_Reconcideracion_Sanc'],
                // [Sequelize.literal(`'GERENCIA'`), 'nombre_Gerencia_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.documento_rg'), 'documento_Gerencia_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.createdAt'), 'Gerencia_createdAt_Reconcideracion_Sanc'],

                // //CONSTANCIA INEXIGILIDAD
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.ConstInexiUsuario.usuario'), 'usuarioConstInexigibilidad_Reconcideracion_Sanc'],
                // [Sequelize.literal(`'CONSTANCIA DE INEXIGIBILIDAD'`), 'nombre_ConstInexigibilidad_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.documento_ci'), 'documento_ConstInexigibilidad_Reconcideracion_Sanc'],
                // [Sequelize.col('IFI.RSA.Reconsideracion.RSGs.RecApelaciones.RGs.inexiRG.createdAt'), 'ConstInexigibilidad_createdAt_Reconcideracion_Sanc'],

                // //APELACION SUBGERENCIAL
                // [Sequelize.col('IFI.RSA.Apelacion.RecApelacionUsuario.usuario'), 'usuarioApelacionSubg_Apelacion_Sanc'],
                // [Sequelize.literal(`'RECURSO DE APELACION'`), 'nombre_ApelacionSubg_Apelacion_Sanc'],
                // [Sequelize.col('IFI.RSA.Apelacion.documento'), 'documento_ApelacionSubg_Apelacion_Sanc'],
                // [Sequelize.col('IFI.RSA.Apelacion.createdAt'), 'ApelacionSubg_createdAt_Apelacion_Sanc'],

                // //GERENCIA
                // [Sequelize.col('IFI.RSA.Apelacion.RGs.rgUsuario.usuario'), 'usuarioGerencia_Apelacion_Sanc'],
                // [Sequelize.literal(`'GERENCIA'`), 'nombre_Gerencia_Apelacion_Sanc'],
                // [Sequelize.col('IFI.RSA.Apelacion.RGs.documento_rg'), 'documento_Gerencia_Apelacion_Sanc'],
                // [Sequelize.col('IFI.RSA.Apelacion.RGs.createdAt'), 'Gerencia_createdAt_Apelacion_Sanc'],

                // //CONSTANCIA INEXIGILIDAD
                // [Sequelize.col('IFI.RSA.Apelacion.RGs.inexiRG.ConstInexiUsuario.usuario'), 'usuarioConstInexigibilidad_Apelacion_Sanc'],
                // [Sequelize.literal(`'CONSTANCIA DE INEXIGIBILIDAD'`), 'nombre_ConstInexigibilidad_Apelacion_Sanc'],
                // [Sequelize.col('IFI.RSA.Apelacion.RGs.inexiRG.documento_ci'), 'documento_ConstInexigibilidad_Apelacion_Sanc'],
                // [Sequelize.col('IFI.RSA.Apelacion.RGs.inexiRG.createdAt'), 'ConstInexigibilidad_createdAt_Apelacion_Sanc'],





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
                    model: Entidad,
                    as: 'entidad',
                    attributes: [],
                },
                {
                    model: Infraccion,
                    as: 'infraccion',
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

        const transformedData = response.rows.map(row => ({
            id: row.get('id'),
            ordenanza: row.get('ordenanza_municipal'),
            razon_social: row.get('razon_social'),
            nro_documento: row.get('nro_documento'),
            numero_nc: row.get('numero_nc'),
            numero_acta: row.get('numero_acta'),
            fecha_NC: row.get('fecha_NC'),
            lugar_infraccion: row.get('lugar_infraccion'),
            actividad_economica: row.get('giro'),
            codigo: row.get('codigo'),
            descripcion: row.get('descripcion'),
            tipo_infraccion: row.get('tipo_infraccion'),
            medida_complementaria: row.get('nombre_MC'),
            monto: row.get('monto'),



            documento_origen: row.get('nro_medida_complementaria'),
            acta_ejecucion: row.get('numero_ejecucion'),
            ejecucion_medida: row.get('tipo_ejecucionMC'),
            levantamiento_medida: row.get('numero_ejecucion'),
            observaciones: row.get('observaciones'),
            nombre_inspector: row.get('usuarioInspector'),

            numero_descargoNC: row.get('numero_descargoNC'),
            fecha_descargoNC: row.get('fecha_descargoNC'),

            numero_IFI: row.get('numero_IFI'),
            fecha_IFI: row.get('fecha_IFI'),
            fecha_notificacion_IFI: row.get('fecha_notificacion_IFI'),

            numero_DIFI: row.get('numero_DIFI'),
            fecha_descargoIFI: row.get('fecha_descargo'),

            //aqui
            numero_RSG1: row.get('numero_RSG1'),
            fecha_RSG1: row.get('fecha_RSG1'),
            fecha_notificacion_RSG1: row.get('fecha_notificacion_RSG1'),

            numero_RSA: row.get('numero_RSA'),
            fecha_RSA: row.get('fecha_RSA'),
            fecha_notificacion_RSA: row.get('fecha_notificacion_RSA'),

            numero_Reconsideracion: row.get('numero_reconsideracion'),
            fecha_Reconsideracion: row.get('fecha_reconsideracion'),

            fecha_RSG2: row.get('fecha_RSG2'),
            numero_RSG2: row.get('numero_RSG2'),
            fecha_notificacion_RSG2: row.get('fecha_notificacion_RSG2'),

            numero_Apelacion: row.get('numero_apelacion'),
            fecha_Apelacion: row.get('fecha_apelacion'),

            fecha_RG: row.get('fecha_RG'),
            numero_RG: row.get('numero_RG'),
            fecha_notificacion_RG: row.get('fecha_notificacion_RG'),

            numero_constancia_Exigibilidad: row.get('numero_constancia_exigibilidad'),
            fecha_Constancia_Exigibilidad: row.get('fecha_constancia_Exigibilidad'),

            // nro_RSG: row.get('numero_RSG'),
            // fecha_emision_RSG: row.get('fecha_RSG'),
            // fecha_notificacion_RSG: row.get('fecha_notificacion_RSG'),
            // resuelve_RSG: (() => {
            //     const estado = row.get('estado_RSG');
            //     return estado === 'RSGP' ? 'SI' : estado === null ? null : 'NO';
            // })(),

        }));

        return { totalCount: response.count, data: transformedData, currentPage: page } || null;

    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los reportes de RSG1", data: error });
        return false;
    }
};

module.exports = {
    getAllDataController
};
