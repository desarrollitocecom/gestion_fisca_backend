const { RSA } = require('../db_connection'); // Asegúrate de que la ruta al modelo sea correcta
const {saveImage,deleteFile}=require('../utils/fileUtils')

const createRsaController = async ({nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA,id_nc,id_estado_RSA}) => {
    let documento_path;
    try {
        documento_path=saveImage(documento_RSA,'Resolucion(RSA)')  

        const newRsa = await RSA.create({
            nro_rsa,
            fecha_rsa,
            fecha_notificacion,
            documento_RSA:documento_path,
            tipo,
            id_evaluar_rsa,
            id_descargo_RSA,
            id_nc,
            id_estado_RSA
        });

        return newRsa || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error al crear RSA:', error);
        return false
    }
};
// Función para actualizar una instancia existente de RSA
const updateRsaController = async ({id, nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA,id_nc,id_estado_RSA}) => {
    let documento_path;

    try {
        // documento_path=saveImage(documento_RSA,'Resolucion(RSA)')  

        const rsa = await RSA.findByPk(id);
        documento_path=rsa.documento_RSA
        if (documento_RSA) {
            documento_path = saveImage(documento_RSA, 'Resolucion(RSA)');
            if (rsa.documento_RSA) {
                deleteFile(rsa.documento_RSA);
            }
        }
        if(rsa){
        await rsa.update({
            nro_rsa,
            fecha_rsa,
            fecha_notificacion,
            documento_RSA:documento_path,
            tipo,
            id_evaluar_rsa,
            id_descargo_RSA,
            id_nc ,
            id_estado_RSA
        });}

        return rsa || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
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
const updateinRsaController = async (uuid, tipo, id_evaluar_rsa) => {
    const Rsa = await RSA.findByPk(uuid);
    if (!Rsa) {
        throw new Error(`Registro con uuid  no encontrado en Rsa.`);
    }

    // Actualizar los campos de Rsa y recargar el registro
    await Rsa.update({ tipo:tipo, id_evaluar_rsa:id_evaluar_rsa });
    const updatedRsa = await Rsa.reload();
    return updatedRsa || null;
};

module.exports = {
    createRsaController,
    updateRsaController,
    getRsaController,
    getAllRsaController,
    updateinRsaController
};
