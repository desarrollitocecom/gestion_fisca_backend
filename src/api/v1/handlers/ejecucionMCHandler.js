const { 
    getAllEjecucionMC, 
    getEjecucionMC, 
    createEjecucionMC, 
    updateEjecucionMC, 
    deleteEjecucionMC 
} = require("../controllers/ejecucionMCController");

// Handler para obtener todas las ejecuciones MC con paginación
const getAllEjecucionMCHandler = async (req, res) => {
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
        const response = await getAllEjecucionMC(Number(page), Number(limit));
        
        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más ejecuciones MC',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Ejecuciones MC obtenidas correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener ejecuciones MC:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener las ejecuciones MC." });
    }
};

// Handler para obtener una ejecución MC por ID
const getEjecucionMCHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const ejecucion = await getEjecucionMC(id);
        if (!ejecucion) {
            return res.status(404).json({ message: "Ejecución MC no encontrada" });
        }

        res.status(200).json(ejecucion);
    } catch (error) {
        console.error("Error al obtener ejecución MC:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener la ejecución MC." });
    }
};

// Handler para crear una ejecución MC
const createEjecucionMCHandler = async (req, res) => {
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
        const response = await createEjecucionMC({ nombre });
        if (!response) {
            return res.status(500).json({ message: "Error al crear la ejecución MC" });
        }

        res.status(201).json({
            message: "Ejecución MC creada exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear ejecución MC:", error);
        res.status(500).json({ error: "Error interno del servidor al crear la ejecución MC." });
    }
};

// Handler para actualizar una ejecución MC
const updateEjecucionMCHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    const errores = [];

    if (isNaN(id) || id <= 0) {
        errores.push('El campo ID es inválido o debe ser un número positivo');
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
        const response = await updateEjecucionMC(id, { nombre });
        if (!response) {
            return res.status(404).json({ message: "Ejecución MC no encontrada para actualizar" });
        }

        res.status(200).json({
            message: "Ejecución MC actualizada correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar ejecución MC:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar la ejecución MC." });
    }
};

// Handler para eliminar una ejecución MC (cambia el estado a false)
const deleteEjecucionMCHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteEjecucionMC(id);
        if (!response) {
            return res.status(404).json({ message: "Ejecución MC no encontrada para eliminar" });
        }

        res.status(200).json({
            message: "Ejecución MC eliminada exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar ejecución MC:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar la ejecución MC." });
    }
};

module.exports = {
    getAllEjecucionMCHandler,
    getEjecucionMCHandler,
    createEjecucionMCHandler,
    updateEjecucionMCHandler,
    deleteEjecucionMCHandler
};
