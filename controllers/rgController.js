const { RG } = require('../db_connection'); 
const {saveImage,deleteFile}=require('../utils/fileUtils')

// Crear un registro RG   
const createRGController = async ({ nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac}) => {
    let documento_path_rg;
    let documento_path_ac;

    try {
        documento_path_rg=saveImage(documento_rg,'Resolucion(RG)/DocumentoRG')       
        documento_path_ac=saveImage(documento_ac,'Resolucion(RG)/DocumentoAC')       

        const newRG = await RG.create({ nro_rg,fecha_rg,fecha_notificacion,documento_rg:documento_path_rg,estado,documento_ac:documento_path_ac});

        return newRG || null;
    } catch (error) {
        if (documento_path_rg) {
            deleteFile(documento_path_rg);
        }
        if (documento_path_ac) {
            deleteFile(documento_path_ac);
        }
        console.error("Error al crear RG:", error);
        return false
    }
};

// Actualizar un registro RG
const updateRGController = async ({id, nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac}) => {
    let documento_path_rg;
    let documento_path_ac;
    try {
        const rg = await getRGController(id);
        documento_path_rg=rg.documento_rg;
        documento_path_ac=rg.documento_ac;
        if (documento_path_rg) {
            // Guardar nuevo archivo y eliminar el anterior
            documento_path_rg = saveImage(documento_rg, 'Resolucion(RG)/DocumentoRG');
            if (rg.documento_path_rg) {
                deleteFile(rg.documento_path_rg);
            }
        }if (documento_path_ac) {
            // Guardar nuevo archivo y eliminar el anterior
            documento_path_ac = saveImage(documento_ac, 'Resolucion(RG)/DocumentoAC');
            if (rg.documento_path_ac) {
                deleteFile(rg.documento_path_ac);
            }
        }
        
        await rg.update({ nro_rg,fecha_rg,fecha_notificacion,documento_rg:documento_path_rg,estado,documento_ac:documento_path_ac});
        return rg || null;
    } catch (error) {
        if (documento_path_rg) {
            deleteFile(documento_path_rg);
        }
        if (documento_path_ac) {
            deleteFile(documento_path_ac);
        }
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
