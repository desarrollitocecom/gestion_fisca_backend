const { 
    getAllTiposDocumentoIdentidad, 
    getTipoDocumentoIdentidad, 
    createTipoDocumentoIdentidad, 
    deleteTipoDocumentoIdentidad, 
    updateTipoDocumentoIdentidad 
} = require("../controllers/tipoDocumentoIdentidadController");

// Handler para obtener todos los tipos de documentos de identidad con paginación
const getAllTiposDocumentoIdentidadHandler = async (req, res) => {
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
        const response = await getAllTiposDocumentoIdentidad(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más tipos de documentos de identidad',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Tipos de documentos de identidad obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener tipos de documentos de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los tipos de documentos de identidad." });
    }
};

// Handler para obtener un tipo de documento de identidad por ID
const getTipoDocumentoIdentidadHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const tipoDocumento = await getTipoDocumentoIdentidad(id);
        if (!tipoDocumento) {
            return res.status(404).json({ message: "Tipo de documento de identidad no encontrado" });
        }

        res.status(200).json(tipoDocumento);
    } catch (error) {
        console.error("Error al obtener tipo de documento de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el tipo de documento de identidad." });
    }
};

// Handler para crear un tipo de documento de identidad
const createTipoDocumentoIdentidadHandler = async (req, res) => {
    const { documento } = req.body;
    const errores = [];

    if (!documento) {
        errores.push('El campo documento es requerido');
    }
    if (typeof documento !== 'string') {
        errores.push('El campo documento debe ser una cadena de texto');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await createTipoDocumentoIdentidad({ documento });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el tipo de documento de identidad" });
        }

        res.status(201).json({
            message: "Tipo de documento de identidad creado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear tipo de documento de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el tipo de documento de identidad." });
    }
};

// Handler para actualizar un tipo de documento de identidad
const updateTipoDocumentoIdentidadHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { documento } = req.body;
    const errores = [];

    if (isNaN(id) || id <= 0) {
        errores.push('El campo ID es inválido o debe ser un número positivo');
    }
    if (!documento) {
        errores.push('El campo documento es requerido');
    }
    if (typeof documento !== 'string') {
        errores.push('El campo documento debe ser una cadena de texto');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await updateTipoDocumentoIdentidad(id, { documento });
        if (!response) {
            return res.status(404).json({ message: "Tipo de documento de identidad no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Tipo de documento de identidad actualizado correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar tipo de documento de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el tipo de documento de identidad." });
    }
};

// Handler para eliminar un tipo de documento de identidad (cambia el estado a false)
const deleteTipoDocumentoIdentidadHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteTipoDocumentoIdentidad(id);
        if (!response) {
            return res.status(404).json({ message: "Tipo de documento de identidad no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Tipo de documento de identidad eliminado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar tipo de documento de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el tipo de documento de identidad." });
    }
};

module.exports = {
    getAllTiposDocumentoIdentidadHandler,
    getTipoDocumentoIdentidadHandler,
    createTipoDocumentoIdentidadHandler,
    updateTipoDocumentoIdentidadHandler,
    deleteTipoDocumentoIdentidadHandler
};
