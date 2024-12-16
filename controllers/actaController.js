const {Acta} = require('../db_connection');
const {saveImage,deleteFile}=require('../utils/fileUtils')
const createActaController=async ({nro_acta,fecha_acta,documento_acta, tipo, id_nc, id_analista_5}) => {
    let documento_path;
    try {

        documento_path = saveImage(documento_acta, "Acta de Consentimiento");
        
        const response = await Acta.create({
            nro_acta,
            fecha_acta,
            documento_acta: documento_path,
            tipo,
            id_nc,
            id_analista_5,
        });
        return response || null;
  
    } catch (error) {
      if (documento_path) {
        deleteFile(documento_path);
      }
      console.error("Error al crear el Informe Final:", error);
      return false;
    }
}

module.exports = { createActaController };
