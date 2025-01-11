const { IFI, DescargoIFI, Usuario, NC, TramiteInspector } = require('../../../config/db_connection');
const { Sequelize } = require('sequelize');
const myCache = require("../../../middlewares/cacheNodeStocked");
const { Op } = require("sequelize");

const { saveImage, deleteFile } = require("../../../utils/fileUtils");

const createInformeFinalController = async ({
  nro_ifi,
  fecha,
  documento_ifi,
  id_nc,
  id_AI1,
  tipo,
  id_cargoNotificacion
}) => {
  let documento_ifi_path;

  try {

    documento_ifi_path = saveImage(documento_ifi, "ifi");

    const response = await IFI.create({
      nro_ifi,
      fecha,
      documento_ifi: documento_ifi_path,
      id_nc,
      id_estado_IFI: 1,
      id_AI1,
      tipo,
      id_cargoNotificacion
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

const updateInformeFinalController = async (id, {
  id_original,
  tipo,
  id_evaluar,
  id_descargo_ifi,
}) => {
  try {
    const updateIfi = await getInformeFinalController(id);

    if (updateIfi) {
      await updateIfi.update({
        id_original,
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
      attributes: ['id', 'id_AI1',
        [Sequelize.col('NCs.id'), 'id_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('Usuarios.usuario'), 'analista1'],
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


    const modifiedResponse = response.map(item => {
      const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
      const cachedValue = myCache.get(`AResolutivaOne-${id}`); // Obtener valor del cache si existe

      return {
        ...item.toJSON(),
        disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
      };
    });




    return modifiedResponse || null;
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

const getAllIFIforPlataformaController = async () => {
  try {
    const response = await IFI.findAll({
      where: {
        tipo: 'ANALISTA_2',
        fecha_notificacion: { [Sequelize.Op.ne]: null }
      },
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

    const modifiedResponse = response.map(item => {
      const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
      const cachedValue = myCache.get(`AnalistaTwo-${id}`); // Obtener valor del cache si existe

      return {
        ...item.toJSON(),
        disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
      };
    });

    return modifiedResponse || null;
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


    const modifiedResponse = response.map(item => {
      const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
      const cachedValue = myCache.get(`AResolutivaTwo-${id}`); // Obtener valor del cache si existe

      return {
        ...item.toJSON(),
        disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
      };
    });



    return modifiedResponse || null;
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











const getIFIforAnalista2Controller = async (id) => {
  try {
    const response = await IFI.findOne({
      where: { id: id },
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

const getAllIFICaduco = async () => {
  try {
    // Obtén la fecha actual y ajusta la zona horaria a Lima, Perú
    const currentDate = new Date(); // Fecha actual
    const limaOffset = -5 * 60; // UTC-5, que es la zona horaria de Lima
    const limaDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() + limaOffset) * 60000);
    //console.log('dia hoy: ', limaDate);


    // Calcula la fecha de hace 9 meses
    limaDate.setMonth(limaDate.getMonth() - 9);
    limaDate.setHours(0, 0, 0, 0); // Ajusta la hora al inicio del día

    // Realiza la consulta
    const response = await IFI.findAll({
      where: {
        createdAt: {
          [Op.lt]: limaDate // Fecha menor a 9 meses
        },
        id_evaluar: null
      }
    });
    //console.log('resposne: ', response);

    // Devuelve la respuesta, o null si no hay datos
    return response.length > 0 ? response : [];
  } catch (error) {
    console.error("Error al obtener los NC caducos:", error);
    return false;
  }
};


const getAllIFISForInstructivaController = async (req, res) => {
  try {
    const response = await IFI.findAll({
      attributes: [
        'id',
        'nro_ifi',
        'documento_ifi',
        //'tipo',
        [Sequelize.literal(`
          CASE 
            WHEN tipo = 'ANALISTA_2' OR tipo = 'RSG1' THEN true
            ELSE false
          END
        `), 'activo'],
        'createdAt',
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
  getAllIFIforPlataformaController,
  getAllIFIforAR2ofRSAController,
  getAllIFIforAR2Controller,
  getAllIFIforRSG2Controller,
  getIFIforAR1Controller,
  getIFIforAnalista2Controller,
  getIFIforAR2Controller,
  getAllIFICaduco,
  getAllIFISForInstructivaController
};
