const { 
    getAllEstadosRSGNP, 
    getEstadoRSGNP, 
    createEstadoRSGNP, 
    updateEstadoRSGNP, 
    deleteEstadoRSGNP 
} = require("../controllers/estadoRSGNPController");

// Handler para obtener todos los estados RSGNP con paginación
const getAllEstadosRSGNPHandler = async (req, res) => {
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
        const response = await getAllEstadosRSGNP(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más estados RSGNP',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Estados RSGNP obtenidos correctamente",
            data: response,
        });
    } catch (error) {
            console.error("Error al obtener estados RSGNP:", error);
            res.status(500).json({ error: "Error interno del servidor al obtener los estados RSGNP." });
    }
};

// Handler para obtener un estado RSGNP por ID
const getEstadoRSGNPHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const estado = await getEstadoRSGNP(id);
        if (!estado) {
            return res.status(404).json({ message: "Estado RSGNP no encontrado" });
        }

        res.status(200).json(estado);
    } catch (error) {
        console.error("Error al obtener estado RSGNP:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el estado RSGNP." });
    }
};

// Handler para crear un estado RSGNP
const createEstadoRSGNPHandler = async (req, res) => {
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
        const response = await createEstadoRSGNP({ nombre });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el estado RSGNP" });
        }

        res.status(201).json({
            message: "Estado RSGNP creado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear estado RSGNP:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el estado RSGNP." });
    }
};

// Handler para actualizar un estado RSGNP
const updateEstadoRSGNPHandler = async (req, res) => {
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
        const response = await updateEstadoRSGNP(id, { nombre });
        if (!response) {
            return res.status(404).json({ message: "Estado RSGNP no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Estado RSGNP actualizado correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar estado RSGNP:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el estado RSGNP." });
    }
};

// Handler para eliminar un estado RSGNP (cambia el estado a false)
const deleteEstadoRSGNPHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteEstadoRSGNP(id);
        if (!response) {
            return res.status(404).json({ message: "Estado RSGNP no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Estado RSGNP eliminado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar estado RSGNP:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el estado RSGNP." });
    }
};

module.exports = {
    getAllEstadosRSGNPHandler,
    getEstadoRSGNPHandler,
    createEstadoRSGNPHandler,
    updateEstadoRSGNPHandler,
    deleteEstadoRSGNPHandler
};
