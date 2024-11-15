const { RSG1,IFI } = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta

// Función para crear una nueva instancia de RSG1
const createRSG1Controller = async ({nro_resolucion, fecha_resolucion, documento}) => {
    try {
        const newRSG1 = await RSG1.create({
            nro_resolucion,
            fecha_resolucion,
            documento
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
// const updateinIfiController = async (uuid, id, vRSG1="RSG1") => {
//     try {
        
//         const rsg1 = await RSG1.findOne({ where: { id } });
//         if (!rsg1) {
//             throw new Error(`Registro con id ${id} no encontrado en RSG1.`);
//         }

        
//         const ifi = await IFI.findByPk(uuid);
//         if (!ifi) {
//             throw new Error(`Registro con uuid ${uuid} no encontrado en IFI.`);
//         }

//         await ifi.update({
//             tipo: vRSG1,
//             id_evaluar: rsg1.id,
//         });

//         const updatedIfi = await ifi.reload();

//         return updatedIfi;
//     } catch (error) {
//         console.error("Error actualizando el registro:", error.message);}}
     

// Función para actualizar una instancia existente de RSG1
const updateRSG1Controller = async ({id, nro_resolucion, fecha_resolucion, documento}) => {
    try {
        const rsg1 = await RSG1.findOne({ where: { id } });

        if (!rsg1) {
            console.error('RSG1 no encontrada');
            return { message: 'RSG1 no encontrada' };
        }
        await rsg1.update({
            nro_resolucion,
            fecha_resolucion,
            documento
        });

        return rsg1 || null;
    } catch (error) {
        console.error('Error al actualizar RSG1:', error);
        return { message: 'Error al actualizar RSG1', error };
    }
};

module.exports = {
    createRSG1Controller,
    updateRSG1Controller,
    //  updateinIfiController,
    getRSG1Controller
};
