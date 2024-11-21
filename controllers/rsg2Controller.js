const { RSG2} = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const {saveImage,deleteFile}=require('../utils/fileUtils')
// Función para crear una nueva instancia de RSG2
const createRSG2Controller = async ({nro_resolucion2, fecha_resolucion, documento}) => {
    let documento_path;
    try {
        documento_path=saveImage(documento,'Resolucion(RSG2)')       
        const newRSG2 = await RSG2.create({
            nro_resolucion2,
            fecha_resolucion,
            documento: documento_path
        });

        return newRSG2 || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear RSG2:', error);
        return false;
    }
};
const getRSG2Controller=async (id) => {
    try {
        const response=await RSG2.findByPk(id)
        return response || null 
    } catch (error) {
        console.error('Error  crear RSG2:', error);
        return false;
    }
}

const updateRSG2Controller = async ({id, nro_resolucion2, fecha_resolucion, documento}) => {
    let documento_path;
    try {
        // documento_path=saveImage(documento,'Resolucion(RSG2)')  ;

        const rsg2 = await RSG2.findOne({ where: { id } });
        documento_path=rsg2.documento
        if (documento) {
            documento_path = saveImage(documento, 'Resolucion(RSG2)');
            if (rsg2.documento) {
                deleteFile(rsg2.documento);
            }
        }
        if (rsg2) {
            await rsg2.update({
                nro_resolucion2,
                fecha_resolucion,
                documento:documento_path
            });
        }

        return rsg2 || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar RSG2:', error);
        return false;
    }
};

module.exports = {
    createRSG2Controller,
    updateRSG2Controller,
    getRSG2Controller
    
}