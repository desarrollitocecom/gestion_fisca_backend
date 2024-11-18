const { DescargoRG } = require('../db_connection');

// Crear un nuevo registro en la tabla DescargoRG
const createDescargoRgController = async ({ nro_descargo, fecha_descargo, documento_descargo }) => {
    try {
        const newDescargoRG = await DescargoRG.create({ nro_descargo, fecha_descargo, documento_descargo });
        return newDescargoRG || null;
    } catch (error) {
        return false
    }
};

// Actualizar un registro existente en la tabla DescargoRG
const updateDescargoRgController = async ({ id, nro_descargo, fecha_descargo, documento_descargo }) => {
    try {
        const descargoRG = await getDescargoRgController(id);
        if (descargoRG) {
            await descargoRG.update({ nro_descargo, fecha_descargo, documento_descargo });
        }       
        return descargoRG || null;
    } catch (error) {
       return false
    }
};

// Obtener un registro específico de la tabla DescargoRG
const getDescargoRgController = async (id) => {
    try {
        const descargoRG = await DescargoRG.findByPk(id);
       return descargoRG || null;
    } catch (error) {
        return false
    }
};

// Obtener todos los registros de la tabla DescargoRG
const getAllDescargoRgController = async () => {
    try {
        const descargoRGs = await DescargoRG.findAll();
        return descargoRGs || null;
    } catch (error) {
        return false
    }
};

// Eliminar un registro de la tabla DescargoRG
// const deleteDescargoRgController = async (id) => {
//     try {
//         const descargoRG = await DescargoRG.findByPk(id);
//         if (!descargoRG) {
//             throw new Error('DescargoRG no encontrado');
//         }
//         await descargoRG.destroy();
//         return `DescargoRG con ID ${id} eliminado correctamente.`;
//     } catch (error) {
//         throw new Error(`Error al eliminar DescargoRG: ${error.message}`);
//     }
// };

module.exports = {
    createDescargoRgController,
    updateDescargoRgController,
    getDescargoRgController,
    getAllDescargoRgController,
    //deleteDescargoRgController,
};
