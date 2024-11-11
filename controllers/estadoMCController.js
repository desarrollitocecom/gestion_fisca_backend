const { EstadoMC } = require("../db_connection");

// Obtener todos los estados MC con paginación
const getAllEstadosMC = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await EstadoMC.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Estados MC", data: error });
        return false;
    }
};

// Obtener un estado MC por ID
const getEstadoMC = async (id) => {
    try {
        const response = await EstadoMC.findOne({ where: { id } });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer el Estado MC", data: error });
        return false;
    }
};

// Crear un nuevo estado MC
const createEstadoMC = async ({ nombre }) => {
    try {
        const response = await EstadoMC.create({ nombre });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Estado MC", data: error });
        return false;
    }
};

// Actualizar un estado MC
const updateEstadoMC = async (id, { nombre }) => {
    try {
        const response = await getEstadoMC(id);
        if (response) await response.update({ nombre });
        return response || null;
    } catch (error) {
        console.error("Error al modificar el Estado MC en el controlador:", error);
        return false;
    }
};

// Eliminar un estado MC (cambia el estado a false)
const deleteEstadoMC = async (id) => {
    try {
        const response = await EstadoMC.findByPk(id);

        if (!response) {
            console.error("Estado MC no encontrado");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        response.state = false;
        await response.save();

        return response;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Estado MC", error);
        return false;
    }
};

module.exports = {
    getAllEstadosMC,
    getEstadoMC,
    createEstadoMC,
    updateEstadoMC,
    deleteEstadoMC
};
