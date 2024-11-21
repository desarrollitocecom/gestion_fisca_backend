const { DescargoRG } = require('../db_connection');
const {saveImage,deleteFile}=require('../utils/fileUtils')

// Crear un nuevo registro en la tabla DescargoRG
const createDescargoRgController = async ({ nro_descargo, fecha_descargo, documento }) => {
    let documento_path;
   
    try {
        documento_path=saveImage(documento,'Descargo(RG)')  
        const newDescargoRG = await DescargoRG.create({ nro_descargo, fecha_descargo, documento:documento_path });
        return newDescargoRG || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear y asociar DescargoRG:', error);     
        return false
    }
};

const updateDescargoRgController = async ({ id, nro_descargo, fecha_descargo, documento }) => {
    let documento_path;
   
    try {
        const descargoRG = await getDescargoRgController(id);

         documento_path = descargoRG.documento;
 
        if (documento) {
            // Guardar nuevo archivo y eliminar el anterior
            documento_path = saveImage(documento, 'Descargo(RG)');
            if (descargoRG.documento) {
                deleteFile(descargoRG.documento);
            }
        }

        await descargoRG.update({ nro_descargo, fecha_descargo, documento: documento_path });
        return descargoRG || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar DescargoRG:', error.message);
        return false;
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
