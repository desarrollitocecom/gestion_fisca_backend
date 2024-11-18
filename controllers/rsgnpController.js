const { RSGNP } = require("../db_connection");

const createRsgnpController = async ({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg }) => {
    try {
        const newRgsnp = await RSGNP.create({
            nro_rsg,
            fecha_rsg,
            fecha_notificacion,
            documento_RSGNP,
            id_descargo_RSGNP,
            id_rg,
        });
        return newRgsnp;
    } catch (error) {
        console.error("Error creating RGSNP:", error);
      return false
    }
};

const updateRsgnpController = async ({ id, nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg }) => {
    try {
        const updated = await RSGNP.update(
            { nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg },
            { where: { id } }
        );
       
        return updated || null;
    } catch (error) {
        console.error("Error updating RGSNP:", error);
        return false

    }
};

const getRsgnpController = async (id) => {
    try {
        const rgsnp = await RSGNP.findByPk(id, {
            include: ['RGs', 'DescargoRGs'], // Incluir asociaciones definidas
        });
        if (!rgsnp) throw new Error("RGSNP not found");
        return rgsnp;
    } catch (error) {
        console.error("Error fetching RGSNP:", error);
        return false
    }
};

const getAllRsgnpController = async () => {
    try {
        const rgsnps = await RSGNP.findAll({
            include: ['RGs', 'DescargoRGs'], // Incluir asociaciones definidas
        });
        return rgsnps;
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
