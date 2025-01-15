const { RSA, Usuario, NC, TramiteInspector, DescargoRSA, ResolucionSancionadora, ResolucionSubgerencial } = require('../../../config/db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const { saveImage, deleteFile } = require('../../../utils/fileUtils')
const { Sequelize } = require('sequelize');
const myCache = require("../../../middlewares/cacheNodeStocked");

const createRSAController = async ({ nro_rsa, fecha_rsa, documento_RSA, id_nc, id_AR2 }) => {
  let documento_path;
  try {
    documento_path = saveImage(documento_RSA, 'Resolucion(RSA)')

    const newRsa = await RSA.create({
      nro_rsa,
      fecha_rsa,
      documento_RSA: documento_path,
      id_nc,
      id_AR2,
      estado: 'PLATAFORMA_SANCION'
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

const createResoSAController = async ({ nro_rsa, fecha_rsa, documento_RSA, id_nc, id_AR2, id_cargoNotificacion }) => {
  let documento_path;
  try {
    documento_path = saveImage(documento_RSA, 'Resolucion(RSA)')

    const newRsa = await ResolucionSancionadora.create({
      nro_rsa,
      fecha_rsa,
      documento_RSA: documento_path,
      id_nc,
      id_AR2,
      estado: 'PLATAFORMA_SANCION',
      id_cargoNotificacion
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


const getAllRSAforAR3Controller = async () => {
  try {
    const response = await RSA.findAll({
      where: { tipo: 'AR3' },
      order: [['id', 'ASC']],
      attributes: [
        'id',
        'createdAt',
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

    const modifiedResponse = response.map(item => {
      const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
      const cachedValue = myCache.get(`AResolutivaThree-${id}`); // Obtener valor del cache si existe

      return {
        ...item.toJSON(),
        disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
      };
    });

    return modifiedResponse || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
    return false;
  }
};
const updateRsaController = async (id, { nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_RSG, id_descargo_RSA, id_nc, id_estado_RSA, id_AR2 }) => {
  try {

    const rsa = await getRsaController(id);
    if (rsa) {
      await rsa.update({
        nro_rsa,
        fecha_rsa,
        fecha_notificacion,
        documento_RSA,
        tipo,
        id_evaluar_rsa,
        id_descargo_RSA,
        id_nc,
        id_RSG,
        id_estado_RSA,
        id_AR2
      });
    }

    return rsa || null;
  } catch (error) {

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
const getAllRSAforAN5Controller = async () => {

  try {
    const response = await RSA.findAll({
      where: { tipo: 'AN5' },
      order: [['id', 'ASC']],
      attributes: [
        'id',
        'createdAt',
        [Sequelize.col('NCs.id'), 'id_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('Usuarios.usuario'), 'analista3'],
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
      ]
    });
    return response || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los RSA para RSG2", data: error });
    return false;
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
  await Rsa.update({ tipo: tipo, id_evaluar_rsa: id_evaluar_rsa });
  const updatedRsa = await Rsa.reload();
  return updatedRsa || null;
};


const getAllRSAforAnalista3Controller = async () => {
  try {
    const response = await RSA.findAll({
      where: { tipo: 'PLATAFORMISTA' },
      order: [['id', 'ASC']],
      attributes: [
        'id',
        'createdAt',
        [Sequelize.col('NCs.id'), 'id_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('Usuarios.usuario'), 'area_resolutiva2'],
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
      const cachedValue = myCache.get(`AnalistaThree-${id}`); // Obtener valor del cache si existe

      return {
        ...item.toJSON(),
        disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
      };
    });

    return modifiedResponse || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
    return false;
  }
};


const getAllRSAforAnalista4Controller = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  try {
    const response = await RSA.findAndCountAll({
      limit,
      offset,
      where: { tipo: 'RSGNP' },
      order: [['id', 'ASC']],
      attributes: [
        'id',
        'createdAt',
        [Sequelize.col('NCs.id'), 'id_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('Usuarios.usuario'), 'area_resolutiva3'],
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

const getAllRSAforAnalista5Controller = async () => {
  try {
    const response = await ResolucionSubgerencial.findAll({
      where: { estado: 'ANALISTA_5' },
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        [Sequelize.col('NCs.id'), 'id_nc'],
        'nro_rsg',
        [Sequelize.col('ResoSubUsuario.usuario'), 'usuario'],
        [Sequelize.literal(`'Analista 3'`), 'area'],
        'createdAt',
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
          as: 'ResoSubUsuario'
        }
        // {
        //   model: DescargoRSA, 
        //   as: 'DescargoRSAs',
        //   include: [
        //     {
        //       model: Usuario,
        //       as: 'Usuarios'
        //     }
        //   ],  
        //   attributes: []
        // },
      ],
    });

    const modifiedResponse = response.map(item => {
      const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
      const cachedValue = myCache.get(`AnalistaFive-AR3-${id}`); // Obtener valor del cache si existe

      return {
        ...item.toJSON(),
        disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
      };
    });


    return modifiedResponse || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
    return false;
  }
};

const getRSAforAnalista5Controller = async (id) => {
  try {
    const response = await RSA.findOne({
      where: { id: id },
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        [Sequelize.col('NCs.id'), 'id_nc'],
        'nro_rsa',
        [Sequelize.col('DescargoRSAs.Usuarios.usuario'), 'usuario'],
        [Sequelize.literal(`'Analista 3'`), 'area'],
        'createdAt',
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
          model: DescargoRSA,
          as: 'DescargoRSAs',
          include: [
            {
              model: Usuario,
              as: 'Usuarios'
            }
          ],
          attributes: []
        },
      ],
    });
    return response || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
    return false;
  }
};



const getRSAforAnalista3Controller = async (id) => {
  try {
    const response = await ResolucionSancionadora.findOne({
      where: { id: id },
      attributes: [
        'id',
        'createdAt',
        [Sequelize.col('NCs.id'), 'id_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('resoSancUsuario.usuario'), 'area_resolutiva2'],
        //'tipo'
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
          as: 'resoSancUsuario',
          attributes: []
        },
      ],
    });
    return response || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
    return false;
  }
};


const getRSGforAnalista3Controller = async (id) => {
  try {
    const response = await ResolucionSubgerencial.findOne({
      where: { id: id },
      attributes: [
        'id',
        'createdAt',
        [Sequelize.col('NCs.id'), 'id_nc'],
        [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
        [Sequelize.col('ResoSubUsuario.usuario'), 'area_resolutiva2'],
        //'tipo'
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
          as: 'ResoSubUsuario',
          attributes: []
        },
      ],
    });
    return response || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
    return false;
  }
};


















const getRSAforAR3Controller = async (id) => {
  try {
    const response = await RSA.findOne({
      where: { id: id },
      attributes: [
        'id',
        'createdAt',
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
    return response || null;
  } catch (error) {
    console.error({ message: "Error en el controlador al traer todos los IFI para RSG2", data: error });
    return false;
  }
};


const getAllRSAforPlataformaController = async () => {
  try {
    const response = await ResolucionSancionadora.findAll({
      where: {
        estado: 'PLATAFORMA_SANCION',
        fecha_notificacion_rsa: { [Sequelize.Op.ne]: null },
        id_evaluar_rsa: null
      }
    });

    const formattedResponse = response.map(item => ({
      id: item.id,
      numero: item.nro_rsa,
      createdAt: item.createdAt,
      id_nc: item.id_nc,
      tipo_viene: 'RSA'
    }));

    return formattedResponse || null;
  } catch (error) {
    return false
  }
}



module.exports = {
  createRSAController,
  updateRsaController,
  getRsaController,
  getAllRsaController,
  getAllRSAforAR3Controller,
  updateinRsaController,
  getAllRSAforAN5Controller,
  getAllRSAforAnalista3Controller,
  getAllRSAforAnalista4Controller,
  getAllRSAforAnalista5Controller,
  getRSAforAnalista3Controller,
  getRSAforAR3Controller,
  getRSAforAnalista5Controller,
  getAllRSAforPlataformaController,
  createResoSAController,
  getRSGforAnalista3Controller
};
