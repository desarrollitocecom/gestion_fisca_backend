const { 
    getAllTipoDocumentoComplementarios, 
    getTipoDocumentoComplementario, 
    createTipoDocumentoComplementario, 
    updateTipoDocumentoComplementario, 
    deleteTipoDocumentoComplementario 
} = require("../controllers/tipoDCController");

// Handler para obtener todos los documentos complementarios con paginación
const getAllTipoDocumentoComplementariosHandler = async (req, res) => {
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
        const response = await getAllTipoDocumentoComplementarios(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más documentos complementarios',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Documentos complementarios obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener documentos complementarios:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los documentos complementarios." });
    }
};

// Handler para obtener un documento complementario por ID
const getTipoDocumentoComplementarioHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const tipoDocumento = await getTipoDocumentoComplementario(id);
        if (!tipoDocumento) {
            return res.status(404).json({ message: "Documento complementario no encontrado" });
        }

        res.status(200).json(tipoDocumento);
    } catch (error) {
        console.error("Error al obtener documento complementario:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el documento complementario." });
    }
};

// Handler para crear un documento complementario
const createTipoDocumentoComplementarioHandler = async (req, res) => {
    const { documento } = req.body;
    const errores = [];

    if (!documento) {
        errores.push('El campo documento es requerido.');
    }
    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await createTipoDocumentoComplementario({ documento });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el documento complementario" });
        }

        res.status(201).json({
            message: "Documento complementario creado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear documento complementario:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el documento complementario." });
    }
};

// Handler para actualizar un documento complementario
const updateTipoDocumentoComplementarioHandler = async (req, res) => {
    const id = req.params.id;
    const { documento } = req.body;
    const errores = [];

    if (!id) {
        errores.push('El campo ID es inválido');
    }
    if (!documento) {
        errores.push('El campo documento es requerido.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await updateTipoDocumentoComplementario(id, { documento });
        if (!response) {
            return res.status(404).json({ message: "Documento complementario no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Documento complementario actualizado correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar documento complementario:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el documento complementario." });
    }
};

// Handler para eliminar un documento complementario (destruir o cambiar estado a false)
const deleteTipoDocumentoComplementarioHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteTipoDocumentoComplementario(id);
        if (!response) {
            return res.status(404).json({ message: "Documento complementario no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Documento complementario eliminado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar documento complementario:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el documento complementario." });
    }
};

module.exports = {
    getAllTipoDocumentoComplementariosHandler,
    getTipoDocumentoComplementarioHandler,
    createTipoDocumentoComplementarioHandler,
    updateTipoDocumentoComplementarioHandler,
    deleteTipoDocumentoComplementarioHandler
};
