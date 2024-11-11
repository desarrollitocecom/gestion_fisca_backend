const { MedidaComplementaria } = require("../db_connection");

// Obtener todas las medidas complementarias con paginación
const getAllMedidasComplementarias = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    try {
        const response = await MedidaComplementaria.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']],
            include: [
                { association: 'tipoDocumento', attributes: ['id', 'documento'] },
                { association: 'ejecucion', attributes: ['id', 'nombre'] },
                { association: 'estado', attributes: ['id', 'nombre'] }
            ]
        });
        return { totalCount: response.count, data: response.rows, currentPage: page } || null;
    } catch (error) {
        console.error("Error en el controlador al traer todas las Medidas Complementarias:", error);
        return false;
    }
};

// Obtener una medida complementaria por ID
const getMedidaComplementaria = async (id) => {
    try {
        const response = await MedidaComplementaria.findOne({
            where: { id },
            include: [
                { association: 'tipoDocumento', attributes: ['id', 'documento'] },
                { association: 'ejecucion', attributes: ['id', 'nombre'] },
                { association: 'estado', attributes: ['id', 'nombre'] }
            ]
        });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al traer la Medida Complementaria:", error);
        return false;
    }
};

// Crear una nueva medida complementaria
const createMedidaComplementaria = async ({ nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado }) => {
    try {
        const response = await MedidaComplementaria.create({ nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado });
        return response || null;
    } catch (error) {
        console.error("Error en el controlador al crear la Medida Complementaria:", error);
        return false;
    }
};

// Actualizar una medida complementaria
const updateMedidaComplementaria = async (id, { nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado }) => {
    try {
        const medida = await getMedidaComplementaria(id);
        if (medida) await medida.update({ nro_acta_ejecucion, dc_levantamiento, id_documento, id_ejecucionMC, id_estado });
        return medida || null;
    } catch (error) {
        console.error("Error al modificar la Medida Complementaria en el controlador:", error);
        return false;
    }
};

// Eliminar una medida complementaria (cambia el estado a false)
const deleteMedidaComplementaria = async (id) => {
    try {
        const medida = await MedidaComplementaria.findByPk(id);

        if (!medida) {
            console.error("Medida Complementaria no encontrada");
            return null;
        }

        // Cambia el estado a false en lugar de eliminar el registro
        medida.state = false;
        await medida.save();

        return medida;
    } catch (error) {
        console.error("Error al cambiar de estado al eliminar Medida Complementaria:", error);
        return false;
    }
};

module.exports = {
    getAllMedidasComplementarias,
    getMedidaComplementaria,
    createMedidaComplementaria,
    updateMedidaComplementaria,
    deleteMedidaComplementaria
};
