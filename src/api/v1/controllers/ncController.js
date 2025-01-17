const { NC, TramiteInspector, MedidaComplementaria, TipoDocumentoComplementario, EjecucionMC, EstadoMC, DescargoNC, Usuario } = require('../../../config/db_connection');
const { Sequelize } = require('sequelize');
const myCache = require("../../../middlewares/cacheNodeStocked");
const { Op } = require("sequelize");

const createNC = async ({ id_tramiteInspector }) => {
    try {
        const newNC = await NC.create({
            id_tramiteInspector,
            estado: 'INICIADO',
            estado_digitado: 'NO_DIGITADO'
        });

        return newNC || null;

    } catch (error) {
        console.error('Error creando NC en el controlador:', error);
        return false;
    }
};

const getNC = async (id) => {
    try {
        const findNC = await NC.findOne({ 
            where: { id } 
        });

        return findNC || null;
    } catch (error) {
        console.error({ message: "Error al encontrar el NC", data: error });
        return false;
    }
}

const updateNC = async (id, data) => {
    try {
        const findNC = await getNC(id);

        if (findNC) {
            await findNC.update(data);
        }
        
        return findNC || null;    
    } catch (error) {
        console.error("Error actualizando NC en el controlador:", error);
        return false;
    }
};

const getAllNCforDigitadorController = async () => {
    try {
        const response = await NC.findAll({
            where: { estado_digitado: 'NO_DIGITADO' }, 
            order: [['createdAt', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'inspector'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.col('tramiteInspector.createdAt'), 'createdAt'],
                [Sequelize.col('estado'), 'estado'],
            ],
            include: [
                {
                    model: TramiteInspector,
                    as: 'tramiteInspector',
                    include: [
                        {
                            model: Usuario, 
                            as: 'inspectorUsuario',
                            attributes: []
                        },
                    ],
                    attributes: []
                }
            ],
        });

        const modifiedResponse = response.map((item, index) => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`Digitador-${id}`); // Obtener valor del cache si existe
            
            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
                blocked: index < 5 ? false : true, // Primeros 5 false, resto true
            };
        });

        return modifiedResponse || null;
    } catch (error) {
        console.error({ message: "Error obteniendo todos los NC en el controlador", data: error });
        return false;
    }
};


const getNCforDigitador = async (id) => {
    try {
        const findNC = await NC.findOne({ 
            where: { id },
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'inspector'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.col('tramiteInspector.createdAt'), 'createdAt'],
                [Sequelize.col('estado'), 'estado'],
            ],
            include: [
                {
                    model: TramiteInspector,
                    as: 'tramiteInspector',
                    include: [
                        {
                            model: Usuario, 
                            as: 'inspectorUsuario',
                            attributes: []
                        },
                    ],
                    attributes: []
                }
            ],
        });
        
        return findNC || null;
    } catch (error) {
        console.error({ message: "Error obteniendo todos los NC para el digitador en el controlador", data: error });
        return false;
    }
}

const getNCforAnalista = async (id) => {
    try {
        const findNC = await NC.findOne({ 
            where: { id } ,
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'digitador'],
                [Sequelize.col('tramiteInspector.createdAt'), 'createdAt'],
                [Sequelize.col('estado'), 'estado'],
                
            ],
            include: [
                {
                    model: TramiteInspector,
                    as: 'tramiteInspector',
                    include: [
                        {
                            model: Usuario, 
                            as: 'inspectorUsuario',
                            attributes: []
                        },
                    ],
                    attributes: []
                },
                {
                    model: Usuario, 
                    as: 'digitadorUsuario',
                    attributes: []
                },
            ],
        });
        
        return findNC || null;
    } catch (error) {
        console.error({ message: "Error al encontrar el NC", data: error });
        return false;
    }
}

const getNCforInstructiva = async (id) => {
    try {
        const response = await NC.findOne({ 
            where: { id: id }, 
            order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('estado'), 'estado'],
                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'analista']
            ],
            include: [
                {
                    model: DescargoNC, 
                    as: 'descargoNC',
                    include: [
                        {
                            model: Usuario,
                            as: 'analistaUsuario',
                            attributes: []
                        }
                    ] ,
                    attributes: []
                },
                {
                    model: TramiteInspector, 
                    as: 'tramiteInspector', 
                    attributes: [], 
                },
            ],
        });
        return response || null;
    } catch (error) {
        console.error({ message: "Error obteniendo todos los NC para el Area Instructiva en el controlador", data: error });
        return false;
    }
};

const getAllNCforInstructiva = async () => {
    console.log('asddasdasd');
    
    try {
        const response = await NC.findAll({ 
            where: { estado: 'A_I' }, 
            order: [['updatedAt', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('estado'), 'estado'],
                [Sequelize.col('descargoNC.analistaUsuario.usuario'), 'analista']
            ],
            include: [
                {
                    model: DescargoNC, 
                    as: 'descargoNC',
                    include: [
                        {
                            model: Usuario,
                            as: 'analistaUsuario',
                            attributes: []
                        }
                    ] ,
                    attributes: []
                },
                {
                    model: TramiteInspector, 
                    as: 'tramiteInspector', 
                    attributes: [], 
                },
            ],
        });

        const modifiedResponse = response.map(item => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`AInstructiva-${id}`); // Obtener valor del cache si existe
        
            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
            };
        });

        return modifiedResponse || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tipos de NC", data: error });
        return false;
    }
};

const getAllNCforAnalista = async () => {
    try {
        const response = await NC.findAll({ 
            where: { estado: 'INICIADO' }, 
            // order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('digitadorUsuario.usuario'), 'digitador'],
                [Sequelize.col('tramiteInspector.createdAt'), 'createdAt'],
                [Sequelize.col('estado'), 'estado']
            ],
            include: [
                {
                    model: Usuario, 
                    as: 'digitadorUsuario',
                    attributes: []
                },
                {
                    model: TramiteInspector, 
                    as: 'tramiteInspector', 
                    attributes: [], 
                },
            ],
        });

        const modifiedResponse = response.map(item => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`AnalistaOne-${id}`); // Obtener valor del cache si existe
        
            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
            };
        });

        return modifiedResponse || null;
    } catch (error) {
        console.error({ message: "Error obteniendo todos los NC para el Analista 1 en el controlador", data: error });
        return false;
    }
};




const getAllNCforPlataformaController = async () => {
    try {
        const response = await NC.findAll({ 
            where: { estado: 'INICIADO' }, 
            // order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'inspector'],
                [Sequelize.col('tramiteInspector.createdAt'), 'createdAt'],
                [Sequelize.col('estado'), 'estado']
            ],
            include: [
                {
                    model: Usuario, 
                    as: 'digitadorUsuario',
                    attributes: []
                },
                {
                    model: TramiteInspector, 
                    as: 'tramiteInspector', 
                    attributes: [], 
                    include: [
                        {
                            model: Usuario, 
                            as: 'inspectorUsuario',
                            attributes: []
                        },
                    ]
                },
            ],
        });

        const modifiedResponse = response.map(item => {
            const id = item.id; // Asumiendo que 'id' es la clave para buscar en el cache
            const cachedValue = myCache.get(`AnalistaOne-${id}`); // Obtener valor del cache si existe
        
            return {
                ...item.toJSON(),
                disabled: cachedValue ? cachedValue.disabled : false, // Si existe en cache usa el valor, si no, default false
            };
        });

        return modifiedResponse || null;
    } catch (error) {
        console.error({ message: "Error obteniendo todos los NC para el Analista 1 en el controlador", data: error });
        return false;
    }
};

const getAllNCCaduco = async () => {
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
      const response = await NC.findAll({
        where: {
          createdAt: {
            [Op.lt]: limaDate // Fecha menor a 9 meses
          },
          id_nro_IFI: null
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
module.exports = { createNC, getNCforInstructiva, updateNC, getAllNCforDigitadorController , 
    getNCforDigitador, getNCforAnalista, getAllNCforInstructiva, getNC, getAllNCforAnalista,
    getAllNCforPlataformaController, getAllNCCaduco /*getAllNCCaduco*/ 
};