const{DescargoRSA}=require('../db_connection');
const createDescargoRsaController=async (nro_descargo,fecha_descargo,documento_descargo,RsaId) => {
    try {
        const newDescargo = await DescargoRSA.create({
            nro_descargo,
            fecha_descargo,
            documento_descargo,
            id_descargo_ifi: RsaId
        });

        return newDescargo || null;
    } catch (error) {
        console.error('Error al crear y asociar DescargoRSA:', error);
        return { message: 'Error al crear y asociar DescargoRSA', error };
    }
}
const updateDescargoRsaController=async (descargoId,nro_descargo,fecha_descargo,documento_descargo,RsaId) => {
    try {
     
        const descargo = await DescargoRSA.findOne({ where: { id: descargoId } });

        await descargo.update({
            nro_descargo,
            fecha_descargo,
            documento_descargo,
            id_descargo_ifi: RsaId 
        });

        return descargo|| null ;
    } catch (error) {
        console.error('Error al actualizar DescargoRSA y asociarlo a rsa:', error);
        return { message: 'Error al actualizar DescargoRSA y asociarlo a rsa', error };
    } 
}
module.exports={

}