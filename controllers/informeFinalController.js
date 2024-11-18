const {IFI,DescargoIFI}=require('../db_connection');
const {saveImage}=require('../utils/fileUtils')
const createInformeFinalController=async ({nro_ifi,fecha,documento_ifi,tipo, id_evaluar,id_descargo_ifi}) => {
    
    try {
        const checking=await DescargoIFI.findByPk(id_descargo_ifi)
        //console.log(id_descargo_ifi);
        
        if(!checking){
        const documento_ifi_path=saveImage(documento_ifi,'ifi')    
        const response=await IFI.create({nro_ifi,fecha,documento_ifi:documento_ifi_path,tipo, id_evaluar,id_descargo_ifi});
        return response || null
        }
         throw new Error("El id de DescargoID ya existe ");
        
    } catch (error) {
        console.error("Error al crear el Informe Final:", error);
        return false;
    }
};

const updateInformeFinalController=async ({id,nro_ifi,fecha,documento_ifi,tipo,id_evaluar, id_descargo_ifi}) => {

    try {
        const updateIfi=await getInformeFinalController(id);
        const documento_ifi_path=saveImage(documento_ifi,'ifi')    

        if(updateIfi){
            await updateIfi.update({
                nro_ifi,
                fecha,
                documento_ifi:documento_ifi_path,
                tipo,
                id_evaluar,
                id_descargo_ifi
                });
        }
      return updateIfi || null;
    } catch (error) {
        console.error('Error al modicar en Informe Final',error);
        return false;
    }
};
const getAllInformeFinalController=async () => {
  try {
    const response=await IFI.findAll({
        include: [{
            model: DescargoIFI,
            as: 'DescargoIFIs'
        }]
    });
    return response || null;
  } catch (error) {
    console.error('Error al traer todos los Informes Finales',error);
    return false;
  }  
};
const getInformeFinalController=async (id) => {
    try {
        const response=await IFI.findOne({where: {id},
        include: [{
            model: DescargoIFI,
            as: 'DescargoIFIs'
        }]});
        return response || null
    } catch (error) {
        console.error('Error al traer un solo Informe Final',error);
        return false;
    }
};
const updateinIfiController = async (uuid, tipo, id_evaluar) => {
    const ifi = await IFI.findByPk(uuid);
    if (!ifi) {
        throw new Error(`Registro con uuid ${uuid} no encontrado en IFI.`);
    }

    // Actualizar los campos de IFI y recargar el registro
    await ifi.update({ tipo:tipo, id_evaluar:id_evaluar });

    const updatedIfi = await ifi.reload();
    
    return updatedIfi;
};


module.exports={
    createInformeFinalController,
    updateInformeFinalController,
    getAllInformeFinalController,
    getInformeFinalController,
    updateinIfiController
}