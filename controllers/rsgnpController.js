const { RSGNP , Usuario,  NC , TramiteInspector } = require("../db_connection");
const {saveImage,deleteFile}=require('../utils/fileUtils')
const { Sequelize } = require('sequelize');

const createRsgnpController = async ({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg,id_nc ,id_AR3}) => {

    let documento_path;
    try {
        documento_path=saveImage(documento_RSGNP,'Resolucion(RSGNP)')       

        const newRgsnp = await RSGNP.create({
            nro_rsg,
            fecha_rsg,
            fecha_notificacion,
            documento_RSGNP:documento_path,
            id_descargo_RSGNP,
            id_rg,
            id_nc,
            id_estado_RSGNP:1,
            id_AR3
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
        const rgsnp = await RSGNP.findByPk(id)
        
        return rgsnp || null;
    } catch (error) {
        console.error("Error fetching RGSNP:", error);
        return false
    }
};
const getAllRSGNPforAN5Controller = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await RSGNP.findAndCountAll({ 
            limit,
            offset,
            where: { tipo: 'AN5' }, 
            order: [['id', 'ASC']],
            attributes: [
                'id','id_AR3', 'createdAt',
                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'analista3'],
            ],
            include: [
                {
                    model: NC, 
                    as: 'NCs',
                    include: [
                      {
                        model: TramiteInspector, 
                        as: 'tramiteInspector', 
                        attributes: [], 
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
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los RSGNP para AN5", data: error });
        return false;
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


module.exports = {
    createRsgnpController,
    updateRsgnpController,
    getRsgnpController,
    getAllRsgnpController,
    getAllRSGNPforAN5Controller
};
