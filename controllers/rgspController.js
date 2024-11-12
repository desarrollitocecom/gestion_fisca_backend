const { RSGP } = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta

// Función para crear una nueva instancia de RSGP
const createRsgpController = async (nro_rsg, fecha_rsg, documento_RSGP) => {
    try {
        const newRsgp = await RSGP.create({
            nro_rsg,
            fecha_rsg,
            documento_RSGP
        });

        return newRsgp || null;
    } catch (error) {
        console.error('Error al crear RSGP:', error);
        return { message: 'Error al crear RSGP', error };
    }
};

// Función para actualizar una instancia existente de RSGP
const updateRsgpController = async (id, nro_rsg, fecha_rsg, documento_RSGP) => {
    try {
        const rsgp = await RSGP.findOne({ where: { id } });

        if (!rsgp) {
            console.error('RSGP no encontrado');
            return { message: 'RSGP no encontrado' };
        }

        await rsgp.update({
            nro_rsg,
            fecha_rsg,
            documento_RSGP
        });

        return rsgp || null;
    } catch (error) {
        console.error('Error al actualizar RSGP:', error);
        return { message: 'Error al actualizar RSGP', error };
    }
};

module.exports = {
    createRsgpController,
    updateRsgpController
};
