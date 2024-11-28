const { RSGNP } = require("../db_connection");
const {saveImage,deleteFile}=require('../utils/fileUtils')

const createRsgnpController = async ({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg,id_nc,id_estado_RSGNP ,id_AR3}) => {
    let documento_path;
    try {
        documento_path=saveImage(documento_RSGNP,'Resolucion(RSGNP)')       

        const newRgsnp = await RSGNP.create({
            nro_rsg,
            fecha_rsg,
            fecha_notificacion,
            documento_RSGNP:documento_path,
            id_descargo_RSGNP,
            id_rg,
            id_nc,
            id_estado_RSGNP,
            id_AR3
        });
        return newRgsnp;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error("Error creating RGSNP:", error);
      return false
    }
};

const updateRsgnpController = async ({ id, nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg ,id_nc,id_estado_RSGNP,id_AR3}) => {
    let documento_path;
    try {
           
        
        const rsgnp = await RSGNP.findOne({ where: { id } });
        documento_path=rsgnp.documento_RSGNP
        if (documento_RSGNP) {
            documento_path = saveImage(documento_RSGNP, 'Resolucion(RSGNP)');
            if (rsgnp.documento_RSGNP) {
                deleteFile(rsgnp.documento_RSGNP);
            }
        }
        if (rsgnp) {
            await rsgnp.update({
                nro_rsg,
                fecha_rsg,
                fecha_notificacion,
                documento_RSGNP:documento_path,
                id_descargo_RSGNP,
                id_rg,
                id_nc,
                id_estado_RSGNP,
                id_AR3
            });
        }
        return rsgnp || null
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error("Error updating RGSNP:", error);
        return false

    }
};

const getRsgnpController = async (id) => {
    try {
        const rgsnp = await RSGNP.findByPk(id, {
            include: ['RGs', 'DescargoRSGNPs'], // Incluir asociaciones definidas
        });
        
        return rgsnp || null;
    } catch (error) {
        console.error("Error fetching RGSNP:", error);
        return false
    }
};

const getAllRsgnpController = async () => {
    try {
        const rgsnps = await RSGNP.findAll({
            include: ['RGs', 'DescargoRSGNPs'], // Incluir asociaciones definidas
        });
        return rgsnps || null;
    } catch (error) {
        console.error("Error fetching all RSGNPs:", error);
        return false
    }
};


module.exports = {
    createRsgnpController,
    updateRsgnpController,
    getRsgnpController,
    getAllRsgnpController   
};
