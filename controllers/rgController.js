const { RG, Usuario,  NC , TramiteInspector } = require('../db_connection'); 
const {saveImage,deleteFile}=require('../utils/fileUtils')
const { Sequelize } = require('sequelize');
// Crear un registro RG   
const createRGController = async ({
     nro_rg,
     fecha_rg,
     fecha_notificacion,
     documento_rg,
     id_nc,
     id_gerente,
     tipo
    }) => {

    let documento_path_rg;

    try {
        documento_path_rg=saveImage(documento_rg,'Resolucion(RG)')            

        const newRG = await RG.create({ 
            nro_rg,
            fecha_rg,
            fecha_notificacion,
            documento_rg:documento_path_rg,
            id_nc,
            id_gerente,
            tipo
        });

        return newRG || null;
    } catch (error) {
        if (documento_path_rg) {
            deleteFile(documento_path_rg);
        }
        console.error("Error al crear RG:", error);
        return false
    }
};
const getAllRGforAnalista5Controller = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await RG.findAndCountAll({ 
            limit,
            offset,
            where: { tipo: 'ANALISTA_5' }, 
            order: [['id', 'ASC']],
            attributes: [
                'id',
                'id_gerente',
                 'createdAt',
                 'tipo',
                [Sequelize.col('NCs.id'), 'id_nc'],
                [Sequelize.col('NCs.tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('Usuarios.usuario'), 'gerente'],
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
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los RSGNP para AN5", data: error });
        return false;
    }
  };


// Actualizar un registro RG
const updateRGController = async (id,{ tipo,id_evaluar_rg,id_estado_RG}) => {
   
    try {
        const rg = await getRGController(id);

        await rg.update({tipo,id_evaluar_rg,id_estado_RG});

        return rg || null;

    } catch (error) {
        console.error("Error al actualizar RG:", error);
        return false
    }
};

// Obtener un registro RG por ID
const getRGController = async (id) => {
    try {
        const rg = await RG.findByPk(id);
        return rg || null;
    } catch (error) {
        console.error("Error al obtener RG:", error);
        return false
    }
};

// Obtener todos los registros RG
const getAllRGController = async () => {
    try {
        const rgs = await RG.findAll();
        return rgs;
    } catch (error) {
        console.error("Error al obtener RGs:", error);
        return false
    }
};

module.exports = {
    createRGController,
    updateRGController,
    getRGController,
    getAllRGController,
    getAllRGforAnalista5Controller
};
