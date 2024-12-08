const { NC, TramiteInspector, MedidaComplementaria, TipoDocumentoComplementario, EjecucionMC, EstadoMC, DescargoNC, Usuario } = require('../db_connection');
const { Sequelize } = require('sequelize');

const createNC = async ({ id_tramiteInspector }) => {
    try {
        const newNC = await NC.create({
            id_tramiteInspector,
            id_estado_NC: 1
        });

        console.log('NC creado con éxito');
        return newNC || null;

    } catch (error) {
        console.error('Error creando trámite:', error);
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

const updateNC = async (id, { 
    id_tipoDocumento, 
    nro_documento, 
            
    id_administrado,
    id_entidad,
    id_infraccion,

    nro_licencia_funcionamiento,
    placa_rodaje,
    fecha_deteccion_inicio,
    fecha_deteccion_fin,
    observaciones,
    
    id_descargo_NC,
    id_const_noti,
    id_digitador,
    id_nro_IFI,
    id_estado_NC
 }) => {

    try {
        const findNC = await getNC(id);

        if (findNC) {
            await findNC.update({
                id_tipoDocumento, 
                nro_documento, 
                        
                id_administrado,
                id_entidad,
                id_infraccion,

                nro_licencia_funcionamiento,
                placa_rodaje,
                fecha_deteccion_inicio,
                fecha_deteccion_fin,
                observaciones,

                id_descargo_NC,
                id_const_noti,
                id_digitador,
                id_nro_IFI,

                id_estado_NC
            });
        }
        
        return findNC || null;
        
    } catch (error) {
        console.error("Error al modificar el Tipo de Documento de Identidad en el controlador:", error);
        return false;
    }
};

const getAllNC = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await NC.findAndCountAll({ 
            limit,
            offset,
            where: { id_estado_NC: 1 }, 
            order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('tramiteInspector.inspectorUsuario.usuario'), 'inspector'],
                [Sequelize.col('tramiteInspector.documento_nc'), 'documento_nc'],
                [Sequelize.col('tramiteInspector.createdAt'), 'createdAt'],
                [Sequelize.col('id_estado_NC'), 'estado'],
                
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
        
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tipos de NC", data: error });
        return false;
    }
};

const getAllNCforInstructiva = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await NC.findAndCountAll({ 
            limit,
            offset,
            where: { id_estado_NC: 3 }, 
            order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('id_estado_NC'), 'estado'],
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
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tipos de NC", data: error });
        return false;
    }
};

const getAllNCforAnalista = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await NC.findAndCountAll({ 
            limit,
            offset,
            where: { id_estado_NC: 2 }, 
            order: [['id', 'ASC']],
            attributes: [
                'id',
                [Sequelize.col('tramiteInspector.nro_nc'), 'nro_nc'],
                [Sequelize.col('digitadorUsuario.usuario'), 'digitador'],
                [Sequelize.col('tramiteInspector.createdAt'), 'createdAt'],
                [Sequelize.col('id_estado_NC'), 'estado']
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
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tipos de NC", data: error });
        return false;
    }
};



const updateNCState = async (id, newState) => {
    try {
        const nc = await NC.findByPk(id); // Busca el registro por ID
        if (!nc) {
            console.error(`No se encontró el NC con ID ${id}.`);
            return null;
        }
        nc.id_estado_NC = newState; // Actualiza el estado del NC
        await nc.save(); // Guarda los cambios en la base de datos
        console.log(`Estado del NC con ID ${id} actualizado a ${newState}.`);
        return nc;
    } catch (error) {
        console.error(`Error al actualizar el estado del NC con ID ${id}:`, error);
        throw error;
    }
};


module.exports = { createNC, updateNC, getNC, getAllNC , updateNCState, getAllNCforInstructiva, getAllNCforAnalista};
