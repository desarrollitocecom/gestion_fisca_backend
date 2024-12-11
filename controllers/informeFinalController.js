const { IFI, DescargoIFI,Usuario,  NC , TramiteInspector} = require("../db_connection");
const { Sequelize } = require('sequelize');

const { saveImage, deleteFile } = require("../utils/fileUtils");

const createInformeFinalController = async ({
  nro_ifi,
  fecha,
  documento_ifi,
  id_nc,
  id_AI1,
  tipo
}) => {
  let documento_ifi_path;

  try {

      documento_ifi_path = saveImage(documento_ifi, "ifi");
      
      console.log(documento_ifi_path);
      
      const response = await IFI.create({
        nro_ifi,
        fecha,
        documento_ifi: documento_ifi_path,
        id_nc,
        id_estado_IFI:1,
        id_AI1,
        tipo
      });
      return response || null;

    throw new Error("El id de DescargoIFI ya existe");
  } catch (error) {
    if (documento_ifi_path) {
      deleteFile(documento_ifi_path);
    }
    console.error("Error al crear el Informe Final:", error);
    return false;
  }
};

const updateInformeFinalController = async (
  id,{
  nro_ifi,
  fecha,
  documento_ifi,
  tipo,
  id_evaluar,
  id_descargo_ifi,
  id_nc,
  id_estado_IFI,
  id_AI1
}) => {
  let documento_ifi_path;
  try {
    const updateIfi = await getInformeFinalController(id);
    documento_ifi_path = updateIfi.documento_ifi;
    if (documento_ifi) {
      documento_ifi_path = saveImage(documento_ifi, "ifi");
      if (updateIfi.documento_ifi) {
        deleteFile(updateIfi.documento_ifi);
      }
    }
    if (updateIfi) {
      await updateIfi.update({
        nro_ifi,
        fecha,
        documento_ifi: documento_ifi_path,
        tipo,
        id_evaluar,
        id_descargo_ifi,
        id_nc,
        id_estado_IFI,
        id_AI1
      });
    }
    return updateIfi || null;
  } catch (error) {
    if (documento_ifi_path) {
      deleteFile(documento_ifi_path);
    }
    console.error("Error al modicar en Informe Final", error);
    return false;
  }
};

const getAllInformeFinalController = async () => {
  try {
    const response = await IFI.findAll({
      where: { tipo: null }, 
      attributes:['id','id_AI1',
                  [Sequelize.col('NCs.id'), 'id_nc'],
                  [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                  [Sequelize.col('Usuarios.usuario'), 'analista1'],
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
    console.error("Error al traer todos los Informes Finales", error);
    return false;
  }
};
const getInformeFinalController = async (id) => {
  try {
    const response = await IFI.findOne({
      where: { id },
      include: [
        {
          model: DescargoIFI,
          as: "DescargoIFIs",
        },
      ],
    });
    return response || null;
  } catch (error) {
    console.error("Error al traer un solo Informe Final", error);
    return false;
  }
};
const updateinIfiController = async (uuid, tipo, id_evaluar) => {
  // Actualizar los campos de IFI y recargar el registro
  try {
    const ifi = await IFI.findByPk(uuid);

    await ifi.update({ tipo: tipo, id_evaluar: id_evaluar });

    const updatedIfi = await ifi.reload();

    return updatedIfi || null;
  } catch (error) {
    console.error("Error al traer un solo Informe Final", error);
    return false;
  }
};

const getAllIFIforAR1Controller = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
      const response = await IFI.findAndCountAll({ 
          limit,
          offset,
          where: { tipo: 'RSG1' }, 
          order: [['id', 'ASC']],
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('Usuarios.usuario'), 'area_instructiva1'],
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
      console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
      return false;
  }
};
const getAllIFIforAR2ofRSAController = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
      const response = await IFI.findAndCountAll({ 
          limit,
          offset,
          where: { tipo: 'RSA' }, 
          order: [['id', 'ASC']],
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('Usuarios.usuario'), 'area_instructiva1'],
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
      console.error({ message: "Error en el controlador al traer todos los IFI para RSA", data: error });
      return false;
  }
};
const getAllIFIforAR2Controller = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
      const response = await IFI.findAndCountAll({ 
          limit,
          offset,
          where: { tipo: 'RSG2' }, 
          order: [['id', 'ASC']],
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('Usuarios.usuario'), 'area_instructiva1'],
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
const getAllIFIforAnalista2Controller = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
      const response = await IFI.findAndCountAll({ 
          limit,
          offset,
          where: { tipo: 'NO_SUB' }, 
          order: [['id', 'ASC']],
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('Usuarios.usuario'), 'area_instructiva1'],
              'tipo',
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
      console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
      return false;
  }
};
const getAllIFIforAreaResolutiva2Controller = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
      const response = await IFI.findAndCountAll({ 
          limit,
          offset,
          where: { tipo: 'AR2' }, 
          order: [['id', 'ASC']],
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('Usuarios.usuario'), 'area_instructiva1'],
              'tipo',
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
      console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
      return false;
  }
};


module.exports = {
  createInformeFinalController,
  updateInformeFinalController,
  getAllInformeFinalController,
  getInformeFinalController,
  updateinIfiController,
  getAllIFIforAR1Controller,
  getAllIFIforAnalista2Controller,
  getAllIFIforAR2ofRSAController,
  getAllIFIforAR2Controller,
  getAllIFIforAreaResolutiva2Controller
};
