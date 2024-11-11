const { 
    getAllEntidades, 
    getEntidadById, 
    createEntidad, 
    updateEntidad, 
    deleteEntidad 
} = require("../controllers/entidadController");

// Handler para obtener todas las entidades con paginación
const getAllEntidadesHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];

    if (!page) errores.push("El campo page es requerido.");
    if (isNaN(page)) errores.push("El page debe ser un número.");
    if (page <= 0) errores.push("El page debe ser mayor a 0.");
    
    if (!limit) errores.push("El campo limit es requerido.");
    if (isNaN(limit)) errores.push("El limit debe ser un número.");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0.");

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const response = await getAllEntidades(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más entidades',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Entidades obtenidas correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener entidades:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener las entidades." });
    }
};

// Handler para obtener una entidad por ID
const getEntidadByIdHandler = async (req, res) => {
    const id = req.params.id;
    const errores = [];

    if (!id) {
        errores.push("El campo ID es requerido.");
    } else if (typeof id !== "string") {
        errores.push("El campo ID debe ser un string.");
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const entidad = await getEntidadById(id);
        if (!entidad) {
            return res.status(404).json({ message: "Entidad no encontrada" });
        }

        res.status(200).json(entidad);
    } catch (error) {
        console.error("Error al obtener entidad:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener la entidad." });
    }
};

// Handler para crear una entidad
const createEntidadHandler = async (req, res) => {
    const { nombre, domicilio, distrito, giro_uso } = req.body;
    const errores = [];

    if (!id) errores.push("El campo ID es requerido.");
    if (id && typeof id !== "string") errores.push("El campo ID debe ser un string.");

    if (!nombre) errores.push("El campo nombre es requerido.");
    if (nombre && typeof nombre !== "string") errores.push("El campo nombre debe ser un string.");

    if (!domicilio) errores.push("El campo domicilio es requerido.");
    if (domicilio && typeof domicilio !== "string") errores.push("El campo domicilio debe ser un string.");

    if (!distrito) errores.push("El campo distrito es requerido.");
    if (distrito && typeof distrito !== "string") errores.push("El campo distrito debe ser un string.");

    if (!giro_uso) errores.push("El campo giro_uso es requerido.");
    if (giro_uso && typeof giro_uso !== "string") errores.push("El campo giro_uso debe ser un string.");

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const response = await createEntidad({ nombre, domicilio, distrito, giro_uso });
        if (!response) {
            return res.status(500).json({ message: "Error al crear la entidad" });
        }

        res.status(201).json({
            message: "Entidad creada exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear entidad:", error);
        res.status(500).json({ error: "Error interno del servidor al crear la entidad." });
    }
};

// Handler para actualizar una entidad por ID
const updateEntidadHandler = async (req, res) => {
    const id = req.params.id;
    const { nombre, domicilio, distrito, giro_uso } = req.body;
    const errores = [];

    if (!id) errores.push("El campo ID es requerido.");
    if (id && typeof id !== "string") errores.push("El campo ID debe ser un string.");

    if (!nombre) errores.push("El campo nombre es requerido.");
    if (nombre && typeof nombre !== "string") errores.push("El campo nombre debe ser un string.");

    if (!domicilio) errores.push("El campo domicilio es requerido.");
    if (domicilio && typeof domicilio !== "string") errores.push("El campo domicilio debe ser un string.");

    if (!distrito) errores.push("El campo distrito es requerido.");
    if (distrito && typeof distrito !== "string") errores.push("El campo distrito debe ser un string.");

    if (!giro_uso) errores.push("El campo giro_uso es requerido.");
    if (giro_uso && typeof giro_uso !== "string") errores.push("El campo giro_uso debe ser un string.");

    if (errores.length > 0) {
        return res.status(400).json({ message:"Se encontraron los siguientes errores:",errores });
    }

    try {
        const response = await updateEntidad(id, { nombre, domicilio, distrito, giro_uso });
        if (!response) {
            return res.status(404).json({ message: "Entidad no encontrada para actualizar" });
        }

        res.status(200).json({
            message: "Entidad actualizada correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar entidad:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar la entidad." });
    }
};

// Handler para eliminar una entidad (eliminar directamente o cambiar el estado)
const deleteEntidadHandler = async (req, res) => {
    const id = req.params.id;
    const errores = [];

    if (!id) errores.push("El campo ID es requerido.");
    if (id && typeof id !== "string") errores.push("El campo ID debe ser un string.");

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const response = await deleteEntidad(id);
        if (!response) {
            return res.status(404).json({ message: "Entidad no encontrada para eliminar" });
        }

        res.status(200).json({
            message: "Entidad eliminada exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar entidad:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar la entidad." });
    }
};

module.exports = {
    getAllEntidadesHandler,
    getEntidadByIdHandler,
    createEntidadHandler,
    updateEntidadHandler,
    deleteEntidadHandler
};
