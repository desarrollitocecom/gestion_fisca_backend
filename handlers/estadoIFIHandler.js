const { 
    getAllEstadosIFI, 
    getEstadoIFI, 
    createEstadoIFI, 
    updateEstadoIFI, 
    deleteEstadoIFI 
} = require("../controllers/estadoIFIController");

// Handler para obtener todos los estados IFI con paginación
const getAllEstadosIFIHandler = async (req, res) => {
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
        const response = await getAllEstadosIFI(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más estados IFI',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Estados IFI obtenidos correctamente",
            data: response,
        });
    } catch (error) {
            console.error("Error al obtener estados IFI:", error);
            res.status(500).json({ error: "Error interno del servidor al obtener los estados IFI." });
    }
};

// Handler para obtener un estado IFI por ID
const getEstadoIFIHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const estado = await getEstadoIFI(id);
        if (!estado) {
            return res.status(404).json({ message: "Estado IFI no encontrado" });
        }

        res.status(200).json(estado);
    } catch (error) {
        console.error("Error al obtener estado IFI:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el estado IFI." });
    }
};

// Handler para crear un estado IFI
const createEstadoIFIHandler = async (req, res) => {
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
        const response = await createEstadoIFI({ nombre });
        if (!response) {
            return res.status(500).json({ message: "Error al crear el estado IFI" });
        }

        res.status(201).json({
            message: "Estado IFI creado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear estado IFI:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el estado IFI." });
    }
};

// Handler para actualizar un estado IFI
const updateEstadoIFIHandler = async (req, res) => {
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
        const response = await updateEstadoIFI(id, { nombre });
        if (!response) {
            return res.status(404).json({ message: "Estado IFI no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "Estado IFI actualizado correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar estado IFI:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el estado IFI." });
    }
};

// Handler para eliminar un estado IFI (cambia el estado a false)
const deleteEstadoIFIHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteEstadoIFI(id);
        if (!response) {
            return res.status(404).json({ message: "Estado IFI no encontrado para eliminar" });
        }

        res.status(200).json({
            message: "Estado IFI eliminado exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar estado IFI:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el estado IFI." });
    }
};

module.exports = {
    getAllEstadosIFIHandler,
    getEstadoIFIHandler,
    createEstadoIFIHandler,
    updateEstadoIFIHandler,
    deleteEstadoIFIHandler
};
