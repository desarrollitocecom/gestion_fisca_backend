const { RG } = require('../db_connection'); 
const {saveImage,deleteFile}=require('../utils/fileUtils')

// Crear un registro RG   
const createRGController = async ({
     nro_rg,
     fecha_rg,
     fecha_notificacion,
     documento_rg,
     id_nc,
     id_gerente}) => {

    let documento_path_rg;

    try {
        documento_path_rg=saveImage(documento_rg,'Resolucion(RG)')            

        const newRG = await RG.create({ 
            nro_rg,
            fecha_rg,
            fecha_notificacion,
            documento_rg:documento_path_rg,
            estado:1,
            id_nc,
            id_gerente});

        return newRG || null;
    } catch (error) {
        if (documento_path_rg) {
            deleteFile(documento_path_rg);
        }
        console.error("Error al crear RG:", error);
        return false
    }
};

// Actualizar un registro RG
const updateRGController = async (id,{ tipo,id_evaluar_rg,id_estado_RG}) => {
   
    try {
        const rg = await getRGController(id);

        await rg.update({tipo,id_evaluar_rg,id_estado_RG});

        return rg || null;

    } catch (error) {
        console.error("Error al actualizar RG:", error);
        return false
    }
};

// Obtener un registro RG por ID
const getRGController = async (id) => {
    try {
        const rg = await RG.findByPk(id);
        return rg || null;
    } catch (error) {
        console.error("Error al obtener RG:", error);
        return false
    }
};

// Obtener todos los registros RG
const getAllRGController = async () => {
    try {
        const rgs = await RG.findAll();
        return rgs;
    } catch (error) {
        console.error("Error al obtener RGs:", error);
        return false
    }
};

module.exports = {
    createRGController,
    updateRGController,
    getRGController,
    getAllRGController,
};
