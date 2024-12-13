const { RSA , Usuario,  NC , TramiteInspector} = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const {saveImage,deleteFile}=require('../utils/fileUtils')
const { Sequelize } = require('sequelize');
const createRsaController = async ({nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo1, id_evaluar_rsa, id_descargo_RSA,id_nc,id_AR2}) => {
    let documento_path;
    try {
        documento_path=saveImage(documento_RSA,'Resolucion(RSA)')  

        const newRsa = await RSA.create({
            nro_rsa,
            fecha_rsa,
            fecha_notificacion,
            documento_RSA:documento_path,
            tipo1,
            id_evaluar_rsa,
            id_descargo_RSA,
            id_nc,
            id_estado_RSA:1,
            id_AR2
        });

        return newRsa || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear RSA:', error);
        return false
    }
};
const getAllRSAforAR3Controller = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await RSA.findAndCountAll({ 
            limit,
            offset,
            where: { tipo: 'AR3' }, 
            order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'area_instructiva3'],
                'tipo'
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
        console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
        return false;
    }
  };
const updateRsaController = async (id,{ nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA,id_nc,id_estado_RSA,id_AR2}) => {
   console.log("tipo",tipo);
   
    let documento_path;

    try {

        const rsa = await getRsaController(id);   
        if(rsa){
        await rsa.update({
            nro_rsa,
            fecha_rsa,
            fecha_notificacion,
            documento_RSA:documento_path,
            tipo,
            id_evaluar_rsa,
            id_descargo_RSA,
            id_nc ,
            id_estado_RSA,
            id_AR2
        });}

        return rsa || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar RSA:', error);
        return false
    }
};

const getRsaController = async (id) => {
    try {
        const rsa = await RSA.findOne({ where: { id } });
        return rsa || null;
    } catch (error) {
        console.error('Error al obtener RSA:', error);
        return false
    }
};


const getAllRsaController = async () => {
    try {
      const response = await RSA.findAll({
        where: { tipo: null }, 
        attributes: ['id', 'id_AR2', 'createdAt',

                    [Sequelize.col('NCs.id'), 'id_nc'],
                    [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                    [Sequelize.col('Usuarios.usuario'), 'analista3'],
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
      return response || null;
    } catch (error) {
      console.error("Error al traer todos los RSA", error);
      return false;
    }
  };
const updateinRsaController = async (uuid, tipo, id_evaluar_rsa) => {
    const Rsa = await RSA.findByPk(uuid);
    if (!Rsa) {
        throw new Error(`Registro con uuid  no encontrado en Rsa.`);
    }

    // Actualizar los campos de Rsa y recargar el registro
    await Rsa.update({ tipo:tipo, id_evaluar_rsa:id_evaluar_rsa });
    const updatedRsa = await Rsa.reload();
    return updatedRsa || null;
};

module.exports = {
    createRsaController,
    updateRsaController,
    getRsaController,
    getAllRsaController,
    getAllRSAforAR3Controller,
    updateinRsaController
};
