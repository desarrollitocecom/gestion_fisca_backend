const { RSG1 } = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta

// Función para crear una nueva instancia de RSG1
const createRSG1Controller = async (nro_resolucion, fecha_resolucion, documento) => {
    try {
        const newRSG1 = await RSG1.create({
            nro_resolucion,
            fecha_resolucion,
            documento
        });

        return newRSG1 || null;
    } catch (error){
        console.error('Error al crear RSG1:', error);
        return {message: 'Error al crear RSG1', error} 
    };   
};


// Función para actualizar una instancia existente de RSG1
const updateRSG1Controller = async (id, nro_resolucion, fecha_resolucion, documento) => {
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
    updateRSG1Controller
};
