const { NC, TramiteInspector, MedidaComplementaria, TipoDocumentoComplementario, EjecucionMC, EstadoMC } = require('../db_connection');

const createNC = async ({ id_tramiteInspector }) => {
    try {
        const newNC = await NC.create({
            id_tramiteInspector
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
    fecha_detencion,
    fecha_notificacion,
    observaciones,
    
    id_descargo_NC,
    id_const_noti,
    id_digitador

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
                fecha_detencion,
                fecha_notificacion,
                observaciones,

                id_descargo_NC,
                id_const_noti,
                id_digitador
            });
        }
        console.log(findNC);
        
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
            attributes: { exclude: ['id_tramiteInspector'] },
            include: [
                {
                    model: TramiteInspector,
                    as: 'tramiteInspector',
                    include: [
                        {
                            model: MedidaComplementaria, 
                            as: 'medidaComplementaria',
                            attributes: { exclude: ['id_estado', 'id_documento', 'id_ejecucionMC'] },
                            include: [
                                {
                                    model: TipoDocumentoComplementario,
                                    as: 'tipoDocumento', 
                                },
                                {
                                    model: EjecucionMC,
                                    as: 'ejecucion'
                                },
                                {
                                    model: EstadoMC,
                                    as: 'estado', 
                                }
                                
                            ],
                        },
                    ],
                }
            ],
            limit,
            offset,
            order: [['id', 'ASC']]
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


module.exports = { createNC, updateNC, getNC, getAllNC , updateNCState};
