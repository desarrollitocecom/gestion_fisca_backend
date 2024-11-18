const { RSG2} = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta

// Función para crear una nueva instancia de RSG2
const createRSG2Controller = async ({nro_resolucion2, fecha_resolucion, documento}) => {
    try {
        const newRSG2 = await RSG2.create({
            nro_resolucion2,
            fecha_resolucion,
            documento
        });

        return newRSG2 || null;
    } catch (error) {
        console.error('Error al crear RSG2:', error);
        return false;
    }
};
const getRSG2Controller=async (id) => {
    try {
        const response=await RSG2.findByPk(id)
        return response || null 
    } catch (error) {
        console.error('Error  crear RSG2:', error);
        return false;
    }
}

const updateRSG2Controller = async (id, nro_resolucion2, fecha_resolucion, documento) => {
    try {
        const rsg2 = await RSG2.findOne({ where: { id } });

        if (!rsg2) {
            console.error('RSG2 no encontrada');
            return { message: 'RSG2 no encontrada' };
        }

        await rsg2.update({
            nro_resolucion2,
            fecha_resolucion,
            documento
        });

        return rsg2 || null;
    } catch (error) {
        console.error('Error al actualizar RSG2:', error);
        return false;
    }
};

module.exports = {
    createRSG2Controller,
    updateRSG2Controller,
    getRSG2Controller
    
}