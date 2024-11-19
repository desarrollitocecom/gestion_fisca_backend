const { RSG1 } = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const {saveImage,deleteFile}=require('../utils/fileUtils')
// Función para crear una nueva instancia de RSG1
const createRSG1Controller = async ({nro_resolucion, fecha_resolucion, documento}) => {
    
    try {
        const documento_path=saveImage(documento,'Resolucion(RSG1)')  
        const newRSG1 = await RSG1.create({
            nro_resolucion,
            fecha_resolucion,
            documento:documento_path
        });

        return newRSG1 || null;
    } catch (error){
        console.error('Error al crear RSG1:', error);
        return false;
    };   
};
const getRSG1Controller=async (id) => {
    try {
        const response=await RSG1.findByPk(id)
        return response || null 
    } catch (error) {
        console.error('Error  crear RSG1:', error);
        return false;
    }
}

const updateRSG1Controller = async ({id, nro_resolucion, fecha_resolucion, documento}) => {
    try {
        const documento_path=saveImage(documento,'Resolucion(RSG1)')  
        const rsg1 = await RSG1.findOne({ where: { id } });
        if(rsg1){
        await rsg1.update({
            nro_resolucion,
            fecha_resolucion,
            documento:documento_path
        });}

        return rsg1 || null;
    } catch (error) {
        console.error('Error al actualizar RSG1:', error);
        return { message: 'Error al actualizar RSG1', error };
    }
};

module.exports = {
    createRSG1Controller,
    updateRSG1Controller,
    getRSG1Controller
};
