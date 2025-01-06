const { RG, Usuario,  NC , TramiteInspector, Infraccion, MedidaComplementaria } = require('../../../config/db_connection'); 
const { Sequelize } = require('sequelize');
const { RSG1, DescargoNC, DescargoRSG, IFI, Entidad, DescargoIFI, RSG2, RSA, DescargoRSA, RSG, Acta } = require('../../../config/db_connection'); 

const getAllDataController = async () => {
    try {
        const response = await NC.findAll({ 
            order: [['id', 'ASC']],
            attributes: [
                'id','ordenanza_municipal','nro_documento', 'lugar_infraccion', 'observaciones', 'tipo_infraccion',
                [Sequelize.col('entidad.nombre_entidad'), 'razon_social'],
                [Sequelize.col('entidad.giro_entidad'), 'giro'],
                [Sequelize.col('tramiteInspector.nro_nc'), 'numero_nc'],
                [Sequelize.col('tramiteInspector.nro_acta'), 'numero_acta'],
                [Sequelize.col('tramiteInspector.createdAt'), 'fecha_NC'],

                [Sequelize.col('infraccion.codigo'), 'codigo'],
                [Sequelize.col('infraccion.descripcion'), 'descripcion'],
                [Sequelize.col('infraccion.monto'), 'monto'],

                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'nombre_inspector'],
                [Sequelize.literal(`'NOTIFICACION DE CARGO'`), 'nombre_nc'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.literal(`'ACTA DE FISCALIZACION'`), 'nombre_acta'],
                [Sequelize.col('tramiteInspector.documento_acta'), 'documento_acta'],
                [Sequelize.col('tramiteInspector.createdAt'), 'inspector_createdAt'],

                [Sequelize.col('digitadorUsuario.usuario'), 'usuarioDigitador'],


                //---------MEDIDA COMPLEMENTARIA-------
                [Sequelize.col('tramiteInspector.medidaComplementaria.nombre_MC'), 'nombre_MC'],
                [Sequelize.col('tramiteInspector.medidaComplementaria.nro_medida_complementaria'), 'nro_medida_complementaria'],
                [Sequelize.col('tramiteInspector.medidaComplementaria.numero_ejecucion'), 'numero_ejecucion'],
                [Sequelize.col('tramiteInspector.medidaComplementaria.tipo_ejecucionMC'), 'tipo_ejecucionMC'],
                

                //----------DESCARGO NC---------
                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'usuarioAnalista1'],
                [Sequelize.literal(`'DESCARGO NC'`), 'nombre_descargoNC'],
                [Sequelize.col('descargoNC.nro_descargo'), 'numero_descargoNC'],//
                [Sequelize.col('descargoNC.fecha_descargo'), 'fecha_descargoNC'],//
                [Sequelize.col('descargoNC.documento'), 'documento_descargoNC'],
                [Sequelize.col('descargoNC.createdAt'), 'analista_createdAt'],

                //----------CREAR INFORME FINAL---------
                [Sequelize.col('IFI.Usuarios.usuario'), 'usuarioAreaInstructiva1'],
                [Sequelize.literal(`'INFORME FINAL'`), 'nombre_AI'],
                [Sequelize.col('IFI.nro_ifi'), 'numero_IFI'],//
                [Sequelize.col('IFI.fecha'), 'fecha_IFI'],//
                [Sequelize.col('IFI.documento_ifi'), 'documento_AI'],
                [Sequelize.col('IFI.createdAt'), 'AI_createdAt'],

                //primera muerte
                //----------------RESOLUCION SUBGERENCIAL 1-------------
                [Sequelize.col('IFI.TERMINADO_RSG1.Usuarios.usuario'), 'usuarioRSG1'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL 1'`), 'nombre_RSG1'],
                [Sequelize.col('IFI.TERMINADO_RSG1.nro_resolucion'), 'numero_RSG1'],//
                [Sequelize.col('IFI.TERMINADO_RSG1.fecha_resolucion'), 'fecha_resolucion1'],//
                [Sequelize.col('IFI.TERMINADO_RSG1.documento'), 'documento_RSG1'],
                [Sequelize.col('IFI.TERMINADO_RSG1.createdAt'), 'RSG1_createdAt'],

                //----------DESCARGO IFI---------
                [Sequelize.col('IFI.DescargoIFIs.analista2Usuario.usuario'), 'usuarioAnalista2'],
                [Sequelize.literal(`'DESCARGO IFI'`), 'nombre_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.nro_descargo'), 'numero_DIFI'],//
                [Sequelize.col('IFI.DescargoIFIs.fecha_descargo'), 'fecha_descargo'],//
                [Sequelize.col('IFI.DescargoIFIs.documento_DIFI'), 'documento_DIFI'],
                [Sequelize.col('IFI.DescargoIFIs.createdAt'), 'analista2_createdAt'],

                //segunda muerte
                //----------------RESOLUCION SUBGERENCIAL 2-------------
                [Sequelize.col('IFI.RSG2.Usuarios.usuario'), 'usuarioAreaInstructiva2'],
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL 2'`), 'nombre_AR2'],
                [Sequelize.col('IFI.RSG2.nro_resolucion2'), 'numero_AR2'],//
                [Sequelize.col('IFI.RSG2.fecha_resolucion'), 'fecha_resolucion2'],//
                [Sequelize.col('IFI.RSG2.documento'), 'documento_AR2'],
                [Sequelize.col('IFI.RSG2.createdAt'), 'AR2_createdAt'],

                //----------------RESOLUCION SANCIONADORA ADMINISTRATIVA-------------
                [Sequelize.col('IFI.RSA.Usuarios.usuario'), 'usuarioAreaInstructiva2'],
                [Sequelize.literal(`'RESOLUCION SANCIONADORA ADMINISTRATIVA'`), 'nombre_RSA'],
                [Sequelize.col('IFI.RSA.nro_rsa'), 'numero_RSA'],//
                [Sequelize.col('IFI.RSA.fecha_rsa'), 'fecha_RSA'],//
                [Sequelize.col('IFI.RSA.fecha_notificacion'), 'fecha_notificacion_RSA'],    //
                [Sequelize.col('IFI.RSA.documento_RSA'), 'documento_RSA'],
                [Sequelize.col('IFI.RSA.createdAt'), 'RSA_createdAt'],

                //----------------DESCARGO RESOLUCION SANCIONADORA ADMINISTRATIVA-------------
                [Sequelize.col('IFI.RSA.DescargoRSAs.Usuarios.usuario'), 'usuarioAnalista3'],
                [Sequelize.literal(`'DESCARGO RSA'`), 'nombre_DRSA'],
                [Sequelize.col('IFI.RSA.DescargoRSAs.nro_descargo'), 'numero_DRSA'],//
                [Sequelize.col('IFI.RSA.DescargoRSAs.fecha_descargo'), 'fecha_DRSA'],//
                [Sequelize.col('IFI.RSA.DescargoRSAs.documento_DRSA'), 'documento_DRSA'],
                [Sequelize.col('IFI.RSA.DescargoRSAs.createdAt'), 'DRSA_createdAt'],

                //----------------RESOLUCION SUBGERENCIAL-------------
                [Sequelize.col('IFI.RSA.RSGs.Usuarios.usuario'), 'usuarioAreaInstructiva3'], 
                [Sequelize.literal(`'RESOLUCION SUBGERENCIAL GENERAL 3'`), 'nombre_RSG3'],
                [Sequelize.col('IFI.RSA.RSGs.nro_rsg'), 'numero_RSG'],//
                [Sequelize.col('IFI.RSA.RSGs.fecha_rsg'), 'fecha_RSG'],//
                [Sequelize.col('IFI.RSA.RSGs.fecha_notificacion'), 'fecha_notificacion_RSG'],//
                [Sequelize.col('IFI.RSA.RSGs.documento_RSG'), 'documento_RSG'],
                [Sequelize.col('IFI.RSA.RSGs.tipo'), 'estado_RSG'],
                [Sequelize.col('IFI.RSA.RSGs.createdAt'), 'RSG3_createdAt'],

                //----------------DESCARGO RESOLUCION SUBGERENCIAL-------------
                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.Usuarios.usuario'), 'usuarioAnalista4'],
                [Sequelize.literal(`'DESCARGO RSG'`), 'nombre_DRSG'],
                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.nro_descargo'), 'nro_DRSG'],//
                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.fecha_descargo'), 'fecha_DRSG'],//
                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.documento_DRSG'), 'documento_DRSG'],
                [Sequelize.col('IFI.RSA.RSGs.DescargoRSGs.createdAt'), 'DRSG_createdAt'],

                //----------------RESOLUCION GERENCIAL-------------
                [Sequelize.col('IFI.RSA.RSGs.RGs.Usuarios.usuario'), 'usuarioGerencia'],
                [Sequelize.literal(`'RESOLUCION GENERAL PROCEDENTE'`), 'nombre_RG'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.nro_rg'), 'numero_RG'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.fecha_rg'), 'fecha_RG'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.fecha_notificacion'), 'fecha_notificacion_RG'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.documento_rg'), 'documento_RG'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.createdAt'), 'RG_createdAt'],
                [Sequelize.col('IFI.RSA.RSGs.RGs.tipo'), 'resuelve_RG'],

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
                        },
                        {
                            model: MedidaComplementaria,
                            as: 'medidaComplementaria'
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
            //etapaNC: row.get('inspector_createdAt') ? {
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
                nombre_inspector: row.get('nombre_inspector'),
                estado_NC: '',

            //} : undefined,
            //etapaDigitador: row.get('usuarioDigitador') ? {
                // usuarioDigitador: row.get('usuarioDigitador'),
                // digitador_createdAt: row.get('inspector_createdAt'),
            //} : undefined,
            //estapaDescargoNC: row.get('usuarioAnalista1') ? {
                numero_descargoNC: row.get('numero_descargoNC'),
                fecha_descargoNC: row.get('fecha_descargoNC'),
            //} : undefined,
            //etapaAreaInstructiva: row.get('usuarioAreaInstructiva1') ? {
                numero_IFI: row.get('numero_IFI'),
                fecha_IFI: row.get('fecha_IFI'),
            //} : undefined,
            //etapaRSG1: row.get('usuarioRSG1') ? {
                
            //} : undefined,
            //etapaDescargoIFI: row.get('usuarioAnalista2') ? {
                numero_DIFI: row.get('numero_DIFI'),
                fecha_descargoIFI: row.get('fecha_descargo'),

                numero_RSG_MC: row.get('numero_RSG1'),
                fecha_RSG1: row.get('fecha_resolucion1'),
                numero_RSG1: row.get('numero_RSG1'),
                fecha_RSG2: row.get('fecha_resolucion2'),
                numero_RSG2: row.get('numero_AR2'),


            //} : undefined,
            //etapaRSA: row.get('usuarioAreaInstructiva2') ? {
                numero_RSA: row.get('numero_RSA'),
                fecha_RSA: row.get('fecha_RSA'),
                fecha_notificacion_RSA: row.get('fecha_notificacion_RSA'),
                estado_RSA: '',
            //} : undefined,
            //etapaDescargoRSA: row.get('usuarioAnalista3') ? {
                numero_DRSA: row.get('numero_DRSA'),
                fecha_DRSA: row.get('fecha_DRSA'),
            //} : undefined,
            //etapaRSG: row.get('usuarioAreaInstructiva3') ? {
                
                nro_RSG: row.get('numero_RSG'),
                fecha_emision_RSG: row.get('fecha_RSG'),
                fecha_notificacion_RSG: row.get('fecha_notificacion_RSG'),
                resuelve_RSG: (() => {
                    const estado = row.get('estado_RSG');
                    return estado === 'RSGP' ? 'SI' : estado === null ? null : 'NO';
                  })(),
            //} : undefined,
            //etapaDescargoRSG: row.get('usuarioAnalista4') ? {
                numero_DRSG: row.get('nro_DRSG'),
                fecha_DRSG: row.get('fecha_DRSG'),
            //} : undefined,
            //etapaRG: row.get('usuarioGerencia') ? {
                numero_RG: row.get('numero_RG'),
                fecha_emision_RG: row.get('fecha_RG'),
                fecha_notificacion_RG: row.get('fecha_notificacion_RG'),
                resuelve_RG: (() => {
                    const estado = row.get('resuelve_RG');
                    return estado === 'FUNDADO' ? 'SI' : estado === null ? null : 'NO';
                  })(),
            //} : undefined,
            //etapaConsentimiento: row.get('usuarioAnalista5') ? {
                // usuarioAnalista5: row.get('usuarioAnalista5'),
                // documento_Acta: {
                //     nombre: row.get('nombre_Acta'),
                //     path: row.get('documento_Acta'),
                // },
                // analista5_createdAt: row.get('Acta_createdAt'),
            //} : undefined
            
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
