const { Entidad } = require("../db_connection");

// Obtener todas las entidades con paginación
const getAllEntidades = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await Entidad.findAndCountAll({
            limit,
            offset,
            order: [['nombre', 'ASC']]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error("Error en el controlador al traer todas las Entidades:", error);
        return false;
    }
};

// Obtener una entidad por ID
const getEntidadById = async (id) => {
    try {
        const response = await Entidad.findOne({ where: { id } });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al traer la Entidad:", error);
        return false;
    }
};

// Crear una nueva entidad
const createEntidad = async ({ nombre, domicilio, distrito, giro_uso }) => {
    try {
        const response = await Entidad.create({ nombre, domicilio, distrito, giro_uso });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al crear la Entidad:", error);
        return false;
    }
};

// Actualizar una entidad por ID
const updateEntidad = async (id, { nombre, domicilio, distrito, giro_uso }) => {
    try {
        const entidad = await getEntidadById(id);
        if (entidad) await entidad.update({ nombre, domicilio, distrito, giro_uso });
        return entidad || null;
    } catch (error) {
        console.error("Error al modificar la Entidad en el controlador:", error);
        return false;
    }
};

// Eliminar una entidad (cambia el estado a false si deseas preservar el registro o elimina directamente)
const deleteEntidad = async (id) => {
    try {
        const entidad = await Entidad.findByPk(id);

        if (!entidad) {
            console.error("Entidad no encontrada");
            return null;
        }

        // Elimina el registro
        await entidad.destroy();
        return entidad;
    } catch (error) {
        console.error("Error al eliminar la Entidad:", error);
        return false;
    }
};

module.exports = {
    getAllEntidades,
    getEntidadById,
    createEntidad,
    updateEntidad,
    deleteEntidad
};
