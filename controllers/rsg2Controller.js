const { RSG2 } = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta

// Función para crear una nueva instancia de RSG2
const createRSG2 = async (nro_resolucion2, fecha_resolucion, documento) => {
    try {
        const newRSG2 = await RSG2.create({
            nro_resolucion2,
            fecha_resolucion,
            documento
        });

        return newRSG2 || null;
    } catch (error) {
        console.error('Error al crear RSG2:', error);
        return { message: 'Error al crear RSG2', error };
    }
};

// Función para actualizar una instancia existente de RSG2
const updateRSG2 = async (id, nro_resolucion2, fecha_resolucion, documento) => {
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
        return { message: 'Error al actualizar RSG2', error };
    }
};

module.exports = {
    createRSG2,
    updateRSG2
};