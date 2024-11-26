const { EjecucionMC } = require("../db_connection");

// Obtener todas las ejecuciones MC con paginación
const getAllEjecucionMC = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await EjecucionMC.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todas las Ejecuciones MC", data: error });
        return false;
    }
};

// Obtener una ejecución MC por ID
const getEjecucionMC = async (id) => {
    try {
        const response = await EjecucionMC.findOne({ where: { id } });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer la Ejecución MC", data: error });
        return false;
    }
};

// Crear una nueva ejecución MC
const createEjecucionMC = async ({ nombre }) => {
    try {
        const response = await EjecucionMC.create({ nombre });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al crear la Ejecución MC", data: error });
        return false;
    }
};

// Actualizar una ejecución MC
const updateEjecucionMC = async (id, { nombre }) => {
    try {
        const response = await getEjecucionMC(id);
        if (response) await response.update({ nombre });
        return response || null;
    } catch (error) {
        console.error("Error al modificar la Ejecución MC en el controlador:", error);
        return false;
    }
};

// Eliminar una ejecución MC (cambia el estado a false)
const deleteEjecucionMC = async (id) => {
    try {
        const response = await EjecucionMC.findByPk(id);

        if (!response) {
            console.error("Ejecución MC no encontrada");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        response.state = false;
        await response.save();

        return response;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Ejecución MC", error);
        return false;
    }
};

module.exports = {
    getAllEjecucionMC,
    getEjecucionMC,
    createEjecucionMC,
    updateEjecucionMC,
    deleteEjecucionMC
};
