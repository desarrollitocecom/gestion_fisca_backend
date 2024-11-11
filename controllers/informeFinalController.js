const {IFI}=require('../db_connection');

const createInformeFinalController=async (nro_ifi,fecha,documento_ifi,tipo,id_evaluar,id_descargo_ifi) => {
    try {
        const response=await IFI.create(id,nro_ifi,fecha,documento_ifi,tipo,id_evaluar,id_descargo_ifi);
        return response
    } catch (error) {
        console.error("Error al crear el Informe Final:", error);
        return false;
    }
};

const updateInformeFinalController=async (id,nro_ifi,fecha,documento_ifi,tipo,id_evaluar,id_descargo_ifi) => {
    try {
        const updateIfi=await IFI.getInformeFinalController(id);
        if(updateIfi){
            await IFI.update({
                nro_ifi:nro_ifi,
                fecha:fecha,
                documento_ifi:documento_ifi,
                tipo:tipo,
                id_evaluar:id_evaluar,
                id_descargo_ifi:id_descargo_ifi
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
        const response=await IFI.findOne({where: {
            id ,           
        },
        include: [{
            model: DescargoIFI,
            as: 'DescargoIFIs'
        }]});
        // const ifi = await IFI.findOne({
        //     where: { id: ifiId },
        //     include: [{
        //         model: DescargoIFI,
        //         as: 'DescargoIFIs'
        //     }]
        // });
        return response || null
    } catch (error) {
        console.error('Error al traer un solo Informe Final',error);
        return false;
    }
};
module.exports={
    createInformeFinalController,
    updateInformeFinalController,
    getAllInformeFinalController,
    getInformeFinalController
}