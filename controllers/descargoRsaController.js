const{DescargoRSA}=require('../db_connection');
const createDescargoRsaController=async ({nro_descargo,fecha_descargo,documento_DRSA}) => {
    console.log();
    
    try {
        const newDescargo = await DescargoRSA.create({
            nro_descargo,
            fecha_descargo,
            documento_DRSA            
        });

        return newDescargo || null;
    } catch (error) {
        console.error('Error al crear y asociar DescargoRSA:', error);
        return { message: 'Error al crear y asociar DescargoRSA', error };
    }
}
const updateDescargoRsaController=async ({id,nro_descargo,fecha_descargo,documento_DRSA}) => {
    try {
     
        const descargo = await DescargoRSA.findOne({ where: { id } });

        await descargo.update({
            nro_descargo,
            fecha_descargo,
            documento_DRSA,

        });

        return descargo|| null ;
    } catch (error) {
        console.error('Error al actualizar DescargoRSA y asociarlo a rsa:', error);
        return { message: 'Error al actualizar DescargoRSA y asociarlo a rsa', error };
    } 
}
module.exports={
    createDescargoRsaController,
    updateDescargoRsaController
}