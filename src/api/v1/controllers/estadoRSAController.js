const { EstadoRSA } = require("../../../config/db_connection");

// Obtener todos los estados RSA con paginación
const getAllEstadosRSA = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await EstadoRSA.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Estados RSA", data: error });
        return false;
    }
};

// Obtener un estado RSAEstadoRSA por ID
const getEstadoRSA = async (id) => {
    try {
        const response = await EstadoRSA.findOne({ where: { id } });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer el Estado RSA", data: error });
        return false;
    }
};

// Crear un nuevo estado RSAEstadoRSA
const createEstadoRSA = async ({ nombre }) => {
    try {
        const response = await EstadoRSA.create({ nombre });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Estado RSA", data: error });
        return false;
    }
};

// Actualizar un estado RSAEstadoRSA
const updateEstadoRSA = async (id, { nombre }) => {
    try {
        const response = await getEstadoRSA(id);
        if (response) await response.update({ nombre });
        return response || null;
    } catch (error) {
        console.error("Error al modificar el Estado RSA en el controlador:", error);
        return false;
    }
};

// Eliminar un estado RSAEstadoRSA (cambia el estado a false)
const deleteEstadoRSA = async (id) => {
    try {
        const response = await EstadoRSA.findByPk(id);

        if (!response) {
            console.error("Estado RSA no encontrado");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        response.state = false;
        await response.save();

        return response;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Estado RSA", error);
        return false;
    }
};

module.exports = {
    getAllEstadosRSA,
    getEstadoRSA,
    createEstadoRSA,
    updateEstadoRSA,
    deleteEstadoRSA
};
