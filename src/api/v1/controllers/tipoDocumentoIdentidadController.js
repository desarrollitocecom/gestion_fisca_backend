const { TipoDocumentoIdentidad } = require("../../../config/db_connection");

// Obtener todos los tipos de documentos de identidad con paginación
const getAllTiposDocumentoIdentidad = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await TipoDocumentoIdentidad.findAndCountAll({ 
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Tipos de Documento de Identidad", data: error });
        return false;
    }
};

// Obtener un tipo de documento de identidad por su ID
const getTipoDocumentoIdentidad = async (id) => {
    try {
        const response = await TipoDocumentoIdentidad.findOne({
            where: { id }
        });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer el Tipo de Documento de Identidad", data: error });
        return false;
    }
};

// Crear un nuevo tipo de documento de identidad
const createTipoDocumentoIdentidad = async ({ documento }) => {
    try {
        const response = await TipoDocumentoIdentidad.create({ documento });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Tipo de Documento de Identidad", data: error });
        return false;
    }
};

// Eliminar un tipo de documento de identidad (cambiar estado a false)
const deleteTipoDocumentoIdentidad = async (id) => {
    try {
        const response = await TipoDocumentoIdentidad.findByPk(id);

        if (!response) {
            console.error("Tipo de Documento de Identidad no encontrado");
            return null;
        }
        response.state = false;
        await response.save();

        return response;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Tipo de Documento de Identidad", error);
        return false;
    }
};

// Actualizar un tipo de documento de identidad
const updateTipoDocumentoIdentidad = async (id, { documento }) => {
    try {
        const response = await getTipoDocumentoIdentidad(id);
        if (response) await response.update({ documento });
        return response || null;
    } catch (error) {
        console.error("Error al modificar el Tipo de Documento de Identidad en el controlador:", error);
        return false;
    }
};

module.exports = {
    getAllTiposDocumentoIdentidad,
    getTipoDocumentoIdentidad,
    createTipoDocumentoIdentidad,
    deleteTipoDocumentoIdentidad,
    updateTipoDocumentoIdentidad
};
