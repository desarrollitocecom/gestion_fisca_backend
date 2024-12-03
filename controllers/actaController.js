const {Acta} = require('../db_connection');
const {saveImage,deleteFile}=require('../utils/fileUtils')
const createActaController=async ({documento_Acta,id_nc,id_Analista_5}) => {
    let documento_path;
    try {
        documento_path=saveImage(documento_Acta,'ACTAS')  
       const  newActa=await Acta.create({
            documento_Acta:documento_path,
            id_nc,
            id_Analista_5
        })
        return newActa || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error creando el Acta:', error);
        return false;
    }
}
module.exports = { createActaController };
