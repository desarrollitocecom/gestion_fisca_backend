const { DescargoRSG } = require('../../../config/db_connection');
const {saveImage,deleteFile}=require('../../../utils/fileUtils')

// Crear un nuevo registro en la tabla DescargoRSGNP
const createDescargoRSGNPController = async ({ nro_descargo, fecha_descargo, documento_DRSGNP ,id_nc,id_analista_4}) => {
    let documento_path;
   
    try {
        if(documento_DRSGNP){
            documento_path=saveImage(documento_DRSGNP,'Descargo(RSGNP)')  
        }
        
        const newDescargoRSGNP = await DescargoRSG.create({ nro_descargo, 
            fecha_descargo,
            documento_DRSG:documento_path,
             id_nc,
             id_analista_4 });
        return newDescargoRSGNP || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear y asociar DescargoRG:', error);     
        return false
    }
};

const updateDescargoRSGNPController = async ( id,{ nro_descargo, fecha_descargo, documento_DRSGNP ,id_nc}) => {
    
    
    let documento_path;
   
    try {
        const descargoRSGNP = await getDescargoRSGNPController(id);

         documento_path = descargoRSGNP.documento_DRSGNP;
 
        if (documento_DRSGNP) {
            // Guardar nuevo archivo y eliminar el anterior
            documento_path = saveImage(documento_DRSGNP, 'Descargo(RSGNP)');
            if (descargoRSGNP.documento_DRSGNP) {
                deleteFile(descargoRSGNP.documento_DRSGNP);
            }
        }

        await descargoRSGNP.update({ nro_descargo, fecha_descargo, documento_DRSGNP: documento_path,id_nc });
        return descargoRSGNP || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar DescargoRSGNP 11:', error.message);
        return false;
    }
};
// Obtener un registro específico de la tabla DescargoRG
const getDescargoRSGNPController = async (id) => {
    try {
        const descargoRSGNP = await DescargoRSGNP.findByPk(id);
       return descargoRSGNP || null;
    } catch (error) {
        return false
    }
};

// Obtener todos los registros de la tabla DescargoRSGNP
const getAllDescargoRSGNPController = async () => {
    try {
        const descargoRSGNPs = await DescargoRSGNP.findAll();
        return descargoRSGNPs || null;
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
    createDescargoRSGNPController,
    updateDescargoRSGNPController,
    getDescargoRSGNPController,
    getAllDescargoRSGNPController,
    //deleteDescargoRgController,
};
