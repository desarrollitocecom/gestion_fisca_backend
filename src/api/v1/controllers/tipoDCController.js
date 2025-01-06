const {TipoDocumentoComplementario} = require('../../../config/db_connection');

const getAllTipoDocumentoComplementarios = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await TipoDocumentoComplementario.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error("Error en el controlador al traer todos los Tipos de Documentos Complementarios:", error);
        return false;
    }
};

// Obtener un documento complementario por ID
const getTipoDocumentoComplementario = async (id) => {
    try {
        const response = await TipoDocumentoComplementario.findOne({ where: { id } });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al traer el Tipo de Documento Complementario:", error);
        return false;
    }
};

// Crear un nuevo documento complementario
const createTipoDocumentoComplementario = async ({ documento }) => {
    try {
        const response = await TipoDocumentoComplementario.create({ documento });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al crear el Tipo de Documento Complementario:", error);
        return false;
    }
};

// Actualizar un documento complementario
const updateTipoDocumentoComplementario = async (id, { documento }) => {
    try {
        const tipoDocumento = await getTipoDocumentoComplementario(id);
        if (tipoDocumento) await tipoDocumento.update({ documento });
        return tipoDocumento || null;
    } catch (error) {
        console.error("Error al modificar el Tipo de Documento Complementario en el controlador:", error);
        return false;
    }
};

// Eliminar un documento complementario , cambia el estado a false 
const deleteTipoDocumentoComplementario = async (id) => {
    try {
        const tipoDocumento = await TipoDocumentoComplementario.findByPk(id);

        if (!tipoDocumento) {
            console.error("Tipo de Documento Complementario no encontrado");
            return null;
        }

        tipoDocumento.state = false;
        await tipoDocumento.save();

    } catch (error) {
        console.error("Error al eliminar el Tipo de Documento Complementario:", error);
        return false;
    }
};

module.exports = {
    getAllTipoDocumentoComplementarios,
    getTipoDocumentoComplementario,
    createTipoDocumentoComplementario,
    updateTipoDocumentoComplementario,
    deleteTipoDocumentoComplementario
}; 