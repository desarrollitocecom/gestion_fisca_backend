const { 
    getAllEstadosRSA, 
    getEstadoRSA, 
    createEstadoRSA, 
    updateEstadoRSA, 
    deleteEstadoRSA 
} = require("../controllers/estadoRSAController");

// Handler para obtener todos los estados RSA con paginación
const getAllEstadosRSAHandler = async (req, res) => {
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
        const response = await getAllEstadosRSA(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más estados RSA',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Estados RSA obtenidos correctamente",
            data: response,
        });
    } catch (error) {
            console.error("Error al obtener estados RSA:", error);
            res.status(500).json({ error: "Error interno del servidor al obtener los estados RSA." });
    }
};

// Handler para obtener un estado RSA por ID
const getEstadoRSAHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const estado = await getEstadoRSA(id);
        if (!estado) {
            return res.status(404).json({ message: "Estado RSA no encontrado" });
        }

        res.status(200).json(estado);
    } catch (error) {
        console.error("Error al obtener estado RSA:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el estado RSA." });
    }
};

// Handler para crear un estado RSA
const createEstadoRSAHandler = async (req, res) => {
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
        const response = await createEstadoRSA({ nombre });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el estado RSA" });
        }

        res.status(201).json({
            message: "Estado RSA creado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear estado RSA:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el estado RSA." });
    }
};

// Handler para actualizar un estado RSA
const updateEstadoRSAHandler = async (req, res) => {
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
        const response = await updateEstadoRSA(id, { nombre });
        if (!response) {
            return res.status(404).json({ message: "Estado RSA no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Estado RSA actualizado correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar estado RSA:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el estado RSA." });
    }
};

// Handler para eliminar un estado RSA (cambia el estado a false)
const deleteEstadoRSAHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteEstadoRSA(id);
        if (!response) {
            return res.status(404).json({ message: "Estado RSA no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Estado RSA eliminado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar estado RSA:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el estado RSA." });
    }
};

module.exports = {
    getAllEstadosRSAHandler,
    getEstadoRSAHandler,
    createEstadoRSAHandler,
    updateEstadoRSAHandler,
    deleteEstadoRSAHandler
};