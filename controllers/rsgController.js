const { RSG , Usuario,  NC , TramiteInspector } = require("../db_connection");
const {saveImage,deleteFile}=require('../utils/fileUtils')
const { Sequelize } = require('sequelize');

const createRSGController = async ({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSG,id_nc ,id_AR3, tipo}) => {

    let documento_path;
    try {
        if(documento_RSG) {
            documento_path=saveImage(documento_RSG,'Resolucion(RSG - Procedente)')       
        }

        const newRgsnp = await RSG.create({
            nro_rsg,
            fecha_rsg,
            fecha_notificacion,
            documento_RSG:documento_path,
            id_nc,
            id_AR3,
            tipo
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

const updateRsgnpController = async (id, {nro_rsg,id_evaluar_rsgnp,tipo, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg ,id_nc,id_estado_RSGNP,id_AR3}) => {
   
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
                     as:'NCs',  
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
                     model:Usuario,
                     as:'Usuarios',
                     attributes:[]
                   },
                   
                 ],
               });
               return { totalCount: rgsnps.count, data: rgsnps.rows, currentPage: page } || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};


const getRSGController = async (id) => {
    try {
        console.log(id);
        const rgsnp = await RSG.findByPk(id)
        
        return rgsnp || null;
    } catch (error) {
        console.error("Error fetching RGSNP:", error);
        return false
    }
};


const getAllRSGforAnalista4Controller = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const rgsnps = await RSG.findAndCountAll({
            limit,
          offset,
          where: { tipo: 'RSGNP' }, 
                 attributes: ['id', 'id_AR3', 'createdAt',
         
                             [Sequelize.col('NCs.id'), 'id_nc'],
                             [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                             [Sequelize.col('Usuarios.usuario'), 'area_resolutiva3'],
                 ],
           
                 include: [
                    { 
                     model: NC, 
                     as:'NCs',  
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
                     model:Usuario,
                     as:'Usuarios',
                     attributes:[]
                   },
                   
                 ],
               });
               return { totalCount: rgsnps.count, data: rgsnps.rows, currentPage: page } || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};


const updateRSGNPController = async (id, {id_descargo_RSG, id_estado_RSGNP, tipo}) => {
   
    try {
           
        
        const rsgnp = await getRsgnpController(id);
       
        if (rsgnp) {
            await rsgnp.update({
                id_descargo_RSG,
                id_estado_RSGNP,
                tipo
            });
        }
        return rsgnp || null
    } catch (error) {
       
        console.error("Error updating RGSNP:", error);
        return false

    }
};



const getAllRSGforGerenciaController = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const rgsnps = await RSG.findAndCountAll({
            limit,
          offset,
          where: { tipo: 'GERENCIA' }, 
                 attributes: ['id', 'id_AR3', 'createdAt',
         
                             [Sequelize.col('NCs.id'), 'id_nc'],
                             [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                             [Sequelize.col('Usuarios.usuario'), 'analista4'],
                 ],
           
                 include: [
                    { 
                     model: NC, 
                     as:'NCs',  
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
                     model:Usuario,
                     as:'Usuarios',
                     attributes:[]
                   },
                   
                 ],
               });
               return { totalCount: rgsnps.count, data: rgsnps.rows, currentPage: page } || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};



const getAllRSGforAnalista5Controller = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const rgsnps = await RSG.findAndCountAll({
            limit,
            offset,
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
                     as:'NCs',  
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
                     model:Usuario,
                     as:'Usuarios',
                     attributes:[]
                   },
                   
                 ],
               });
               return { totalCount: rgsnps.count, data: rgsnps.rows, currentPage: page } || null;

    } catch (error) {
        console.error("Error al traer los RSGNPs:", error);
        return false
    }
};



module.exports = {
    createRSGController,
    updateRsgnpController,
    getRsgnpController,
    getAllRsgnpController,
    getAllRSGNPforAN5Controller,
    getRSGController,
    getAllRSGforAnalista4Controller,
    updateRSGNPController,
    getAllRSGforGerenciaController,
    getAllRSGforAnalista5Controller
};
