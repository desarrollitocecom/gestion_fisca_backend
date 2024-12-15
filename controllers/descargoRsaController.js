const{DescargoRSA}=require('../db_connection');
const {saveImage,deleteFile}=require('../utils/fileUtils')

const createDescargoRSAController=async ({nro_descargo,fecha_descargo,documento_DRSA,id_nc,id_estado,id_analista_3}) => {
    let documento_path;

    try {
        if(documento_DRSA){
            documento_path=saveImage(documento_DRSA,'Descargo(RSA)')  
        }

        const newDescargo = await DescargoRSA.create({
            nro_descargo,
            fecha_descargo,
            documento_DRSA:documento_path,
            id_nc,
            id_estado,
            id_analista_3
        });

        return newDescargo || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear y asociar DescargoRSA:', error);
        return false
    }
}
const updateDescargoRsaController=async ({id,nro_descargo,fecha_descargo,documento_DRSA,id_nc,id_analista_3}) => {
    let documento_path;
    try {
        const descargo = await DescargoRSA.findOne({ where: { id } });
        documento_path=descargo.documento_DRSA
        if (documento_DRSA) {
            documento_path = saveImage(documento_DRSA, 'Descargo(RSA)');
            if (descargo.documento_DRSA) {
                deleteFile(descargo.documento_DRSA);
            }
        }
        if(descargo){
        await descargo.update({
            nro_descargo,
            fecha_descargo,
            documento_DRSA:documento_path,
            id_nc,
            id_analista_3
        });}

        return descargo|| null ;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al actualizar DescargoRSA y asociarlo a rsa:', error);
        return false
    } 
}
module.exports={
    createDescargoRSAController,
    updateDescargoRsaController
}