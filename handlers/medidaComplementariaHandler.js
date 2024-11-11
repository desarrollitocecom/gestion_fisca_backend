const {getAllMedidasComplementarias,getMedidaComplementaria,createMedidaComplementaria
    ,deleteMedidaComplementaria,updateMedidaComplementaria
}= require('../controllers/medidaComplementariaController');

const getAllMedidasComplementariasHandler = async (req, res) => {
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
        const response = await getAllMedidasComplementarias(Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más medidas complementarias',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }

        return res.status(200).json({
            message: "Medidas complementarias obtenidas correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener medidas complementarias:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener las medidas complementarias." });
    }
};

// Handler para obtener una medida complementaria por ID
const getMedidaComplementariaHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const medida = await getMedidaComplementaria(id);
        if (!medida) {
            return res.status(404).json({ message: "Medida complementaria no encontrada" });
        }

        res.status(200).json(medida);
    } catch (error) {
        console.error("Error al obtener medida complementaria:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener la medida complementaria." });
    }
};

// Handler para crear una medida complementaria
const createMedidaComplementariaHandler = async (req, res) => {
    const { nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado } = req.body;
    const errores = [];

    if (!nro_acta_ejecucion || isNaN(nro_acta_ejecucion)) {
        errores.push('El campo nro_acta_ejecucion es requerido y debe ser un número.');
    }
    if (!id_documento) {
        errores.push('El campo id_documento es requerido.');
    }
    if (!id_ejecucionMC) {
        errores.push('El campo id_ejecucionMC es requerido.');
    }
    if (!id_estado) {
        errores.push('El campo id_estado es requerido.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await createMedidaComplementaria({ nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado });
        if (!response) {
            return res.status(500).json({ message: "Error al crear la medida complementaria" });
        }

        res.status(201).json({
            message: "Medida complementaria creada exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al crear medida complementaria:", error);
        res.status(500).json({ error: "Error interno del servidor al crear la medida complementaria." });
    }
};

// Handler para actualizar una medida complementaria
const updateMedidaComplementariaHandler = async (req, res) => {
    const id = req.params.id;
    const { nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado } = req.body;
    const errores = [];

    if (!id) {
        errores.push('El campo ID es inválido');
    }
    if (!nro_acta_ejecucion || isNaN(nro_acta_ejecucion)) {
        errores.push('El campo nro_acta_ejecucion es requerido y debe ser un número.');
    }
    if (!id_documento) {
        errores.push('El campo id_documento es requerido.');
    }
    if (!id_ejecucionMC) {
        errores.push('El campo id_ejecucionMC es requerido.');
    }
    if (!id_estado) {
        errores.push('El campo id_estado es requerido.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Se encontraron los siguientes errores', errores });
    }

    try {
        const response = await updateMedidaComplementaria(id, { nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado });
        if (!response) {
            return res.status(404).json({ message: "Medida complementaria no encontrada para actualizar" });
        }

        res.status(200).json({
            message: "Medida complementaria actualizada correctamente",
            data: response
        });
    } catch (error) {
        console.error("Error al actualizar medida complementaria:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar la medida complementaria." });
    }
};

// Handler para eliminar una medida complementaria (cambia el estado a false)
const deleteMedidaComplementariaHandler = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const response = await deleteMedidaComplementaria(id);
        if (!response) {
            return res.status(404).json({ message: "Medida complementaria no encontrada para eliminar" });
        }

        res.status(200).json({
            message: "Medida complementaria eliminada exitosamente",
            data: response
        });
    } catch (error) {
        console.error("Error al eliminar medida complementaria:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar la medida complementaria." });
    }
};

module.exports = {
    getAllMedidasComplementariasHandler,
    getMedidaComplementariaHandler,
    createMedidaComplementariaHandler,
    updateMedidaComplementariaHandler,
    deleteMedidaComplementariaHandler
};