const { RSA } = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const createRsaController = async (nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA) => {
    try {
        const newRsa = await RSA.create({
            nro_rsa,
            fecha_rsa,
            fecha_notificacion,
            documento_RSA,
            tipo,
            id_evaluar_rsa,
            id_descargo_RSA
        });

        return newRsa || null;
    } catch (error) {
        console.error('Error al crear RSA:', error);
        return false
    }
};
// Función para actualizar una instancia existente de RSA
const updateRsaController = async (id, nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA) => {
    try {
        const rsa = await RSA.findOne({ where: { id } });

        if (!rsa) {
            console.error('RSA no encontrada');
            return { message: 'RSA no encontrada' };
        }

        await rsa.update({
            nro_rsa,
            fecha_rsa,
            fecha_notificacion,
            documento_RSA,
            tipo,
            id_evaluar_rsa,
            id_descargo_RSA
        });

        return rsa || null;
    } catch (error) {
        console.error('Error al actualizar RSA:', error);
        return false
    }
};
// Función para obtener una instancia de RSA por su ID
const getRsaController = async (id) => {
    try {
        const rsa = await RSA.findOne({ where: { id } });
        return rsa || null;
    } catch (error) {
        console.error('Error al obtener RSA:', error);
        return false
    }
};
// Función para obtener todas las instancias de RSA
const getAllRsaController = async () => {
    try {
        const rsas = await RSA.findAll();
        return rsas || null;
    } catch (error) {
        console.error('Error al obtener todas las RSAs:', error);
        return false;
    }
};
module.exports = {
    createRsaController,
    updateRsaController,
    getRsaController,
    getAllRsaController
};
