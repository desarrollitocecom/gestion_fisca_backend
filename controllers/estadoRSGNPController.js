const { EstadoRSGNP } = require("../db_connection");

// Obtener todos los estados RSGNPcon paginación
const getAllEstadosRSGNP = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await EstadoRSGNP.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Estados RSGNP", data: error });
        return false;
    }
};

// Obtener un estado RSGNP por ID
const getEstadoRSGNP = async (id) => {
    try {
        const response = await EstadoRSGNP.findOne({ where: { id } });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer el Estado RSGNP", data: error });
        return false;
    }
};

// Crear un nuevo estado RSGNP
const createEstadoRSGNP = async ({ nombre }) => {
    try {
        const response = await EstadoRSGNP.create({ nombre });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Estado RSGNP", data: error });
        return false;
    }
};

// Actualizar un estado RSGNPEstadoRSGNP
const updateEstadoRSGNP = async (id, { nombre }) => {
    try {
        const response = await getEstadoRSGNP(id);
        if (response) await response.update({ nombre });
        return response || null;
    } catch (error) {
        console.error("Error al modificar el Estado RSGNP en el controlador:", error);
        return false;
    }
};

// Eliminar un estado RSGNP (cambia el estado a false)
const deleteEstadoRSGNP = async (id) => {
    try {
        const response = await EstadoRSGNP.findByPk(id);

        if (!response) {
            console.error("Estado RSGNP no encontrado");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        response.state = false;
        await response.save();

        return response;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Estado ", error);
        return false;
    }
};

module.exports = {
    getAllEstadosRSGNP,
    getEstadoRSGNP,
    createEstadoRSGNP,
    updateEstadoRSGNP,
    deleteEstadoRSGNP
};
