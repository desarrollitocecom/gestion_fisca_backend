const { EstadoIFI } = require("../db_connection");

// Obtener todos los estados IFI con paginación
const getAllEstadosIFI = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await EstadoIFI.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer todos los Estados IFI", data: error });
        return false;
    }
};

// Obtener un estado IFI por ID
const getEstadoIFI = async (id) => {
    try {
        const response = await EstadoIFI.findOne({ where: { id } });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al traer el Estado IFI", data: error });
        return false;
    }
};

// Crear un nuevo estado IFI
const createEstadoIFI = async ({ nombre }) => {
    try {
        const response = await EstadoIFI.create({ nombre });
        return response || null;
    } catch (error) {
        console.error({ message: "Error en el controlador al crear el Estado IFI", data: error });
        return false;
    }
};

// Actualizar un estado IFI
const updateEstadoIFI = async (id, { nombre }) => {
    try {
        const response = await getEstadoIFI(id);
        if (response) await response.update({ nombre });
        return response || null;
    } catch (error) {
        console.error("Error al modificar el Estado IFI en el controlador:", error);
        return false;
    }
};

// Eliminar un estado IFI (cambia el estado a false)
const deleteEstadoIFI = async (id) => {
    try {
        const response = await EstadoIFI.findByPk(id);

        if (!response) {
            console.error("Estado IFI no encontrado");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        response.state = false;
        await response.save();

        return response;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Estado IFI", error);
        return false;
    }
};

module.exports = {
    getAllEstadosIFI,
    getEstadoIFI,
    createEstadoIFI,
    updateEstadoIFI,
    deleteEstadoIFI
};
