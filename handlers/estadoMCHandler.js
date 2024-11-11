const { 
    getAllEstadosMC, 
    getEstadoMC, 
    createEstadoMC, 
    updateEstadoMC, 
    deleteEstadoMC 
} = require("../controllers/estadoMCController");

// Handler para obtener todos los estados MC con paginación
const getAllEstadosMCHandler = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const errores = [];

    if (isNaN(page)) errores.push("El page debe ser un número");
    if (page <= 0) errores.push("El page debe ser mayor a 0");
    if (isNaN(limit)) errores.push("El limit debe ser un número");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0");

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const response = await getAllEstadosMC(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más estados MC',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Estados MC obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener estados MC:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los estados MC." });
    }
};

// Handler para obtener un estado MC por ID
const getEstadoMCHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const estado = await getEstadoMC(id);
        if (!estado) {
            return res.status(404).json({ message: "Estado MC no encontrado" });
        }

        res.status(200).json(estado);
    } catch (error) {
        console.error("Error al obtener estado MC:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el estado MC." });
    }
};

// Handler para crear un estado MC
const createEstadoMCHandler = async (req, res) => {
    const { nombre } = req.body;
    const errores = [];

    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await createEstadoMC({ nombre });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el estado MC" });
        }

        res.status(201).json({
            message: "Estado MC creado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear estado MC:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el estado MC." });
    }
};

// Handler para actualizar un estado MC
const updateEstadoMCHandler = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    const errores = [];

    if (!id) {
        errores.push('El campo ID es inválido');
    }
    if (!nombre) {
        errores.push('El campo nombre es requerido');
    }
    if (typeof nombre !== 'string') {
        errores.push('El campo nombre debe ser una cadena de texto');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await updateEstadoMC(id, { nombre });
        if (!response) {
            return res.status(404).json({ message: "Estado MC no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Estado MC actualizado correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar estado MC:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el estado MC." });
    }
};

// Handler para eliminar un estado MC (cambia el estado a false)
const deleteEstadoMCHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteEstadoMC(id);
        if (!response) {
            return res.status(404).json({ message: "Estado MC no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Estado MC eliminado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar estado MC:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el estado MC." });
    }
};

module.exports = {
    getAllEstadosMCHandler,
    getEstadoMCHandler,
    createEstadoMCHandler,
    updateEstadoMCHandler,
    deleteEstadoMCHandler
};
