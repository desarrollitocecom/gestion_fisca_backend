const { RSG1 } = require('../db_connection'); 
const {saveImage,deleteFile}=require('../utils/fileUtils')

const createRSG1Controller = async ({nro_resolucion, fecha_resolucion, documento,id_nc,id_AR1}) => {
    let documento_path;

    try {
        documento_path=saveImage(documento,'Resolucion(RSG1)')  
        
        const newRSG1 = await RSG1.create({
            nro_resolucion,
            fecha_resolucion,
            documento:documento_path,
            id_nc,
            id_AR1
        });

        return newRSG1 || null;
    } catch (error){
        if (documento_path) {
            deleteFile(documento_path);
        }
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

const updateRSG1Controller = async ({id, nro_resolucion, fecha_resolucion, documento,id_nc,id_AR1}) => {
    let documento_path;
    try {
          
        const rsg1 = await RSG1.findOne({ where: { id } });
        documento_path=rsg1.documento
        if (documento) {
            documento_path = saveImage(documento, 'Resolucion(RSG1)');
            if (rsg1.documento) {
                deleteFile(rsg1.documento);
            }
        }
        if(rsg1){
        await rsg1.update({
            nro_resolucion,
            fecha_resolucion,
            documento:documento_path,
            id_nc,
            id_AR1
        });}

        return rsg1 || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar RSG1:', error);
        return { message: 'Error al actualizar RSG1', error };
    }
};

module.exports = {
    createRSG1Controller,
    updateRSG1Controller,
    getRSG1Controller
};
