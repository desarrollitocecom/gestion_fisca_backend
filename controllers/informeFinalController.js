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

  } catch (error) {
    if (documento_ifi_path) {
      deleteFile(documento_ifi_path);
    }
    console.error("Error al crear el Informe Final desde el Controlador:", error);
    return false;
  }
};

const updateInformeFinalController = async (id,{
    tipo,
    id_evaluar,
    id_descargo_ifi,
  }) => {
  try {
    const updateIfi = await getInformeFinalController(id);

    if (updateIfi) {
      await updateIfi.update({
        tipo,
        id_evaluar,
        id_descargo_ifi,
      });
    }
    return updateIfi || null;
  } catch (error) {
    console.error("Error al actualizar Informe Final desde el controlador", error);
    return false;
  }
};

const getAllInformeFinalController = async () => {
  try {
    const response = await IFI.findAll({
      where: { tipo: null }, 
      order: [['createdAt', 'ASC']],
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
    console.error("Error al traer todos los IFIs desde el controlador", error);
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
    console.error("Error al traer un solo IFI desde el controlador ", error);
    return false;
  }
};

const getAllIFIforAR1Controller = async () => {
  try {
      const response = await IFI.findAll({ 
          where: { tipo: 'RSG1' }, 
          order: [['id', 'ASC']],
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
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
      return response || null;
  } catch (error) {
      console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
      return false;
  }
};




















const getIFIforAR1Controller = async (id) => {
  try {
      const response = await IFI.findOne({ 
          where: { id: id }, 
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
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
      return response || null;
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
const getAllIFIforRSG2Controller = async (page = 1, limit = 20) => {
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
const getAllIFIforAnalista2Controller = async () => {
  try {
      const response = await IFI.findAll({ 
          where: { tipo: 'ANALISTA_2' }, 
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
      return response || null;
  } catch (error) {
      console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
      return false;
  }
};
const getAllIFIforAR2Controller = async () => {
  try {
      const response = await IFI.findAll({ 
          where: { tipo: 'AR2' }, 
          order: [['id', 'ASC']],
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('Usuarios.usuario'), 'Analista2'],
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
      return response || null;
  } catch (error) {
      console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
      return false;
  }
};




const getIFIforAR2Controller = async (id) => {
  try {
      const response = await IFI.findOne({ 
          where: { id: id }, 
          attributes: [
              'id',
              [Sequelize.col('NCs.id'), 'id_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
              [Sequelize.col('Usuarios.usuario'), 'Analista2'],
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
      return response || null;
  } catch (error) {
      console.error({ message: "Error en el controlador al traer todos los IFI para RSG1", data: error });
      return false;
  }
};











const getIFIforAnalista2Controller = async () => {
  try {
      const response = await IFI.findOne({ 
          where: { tipo: 'ANALISTA_2' }, 
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
      return response || null;
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
  // updateinIfiController,
  getAllIFIforAR1Controller,
  getAllIFIforAnalista2Controller,
  getAllIFIforAR2ofRSAController,
  getAllIFIforAR2Controller,
  getAllIFIforRSG2Controller,
  getIFIforAR1Controller,
  getIFIforAnalista2Controller,
  getIFIforAR2Controller
};
