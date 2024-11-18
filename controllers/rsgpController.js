const { RSGP } = require('../db_connection');

const createRsgpController = async ({ nro_rsg, fecha_rsg, documento_RSGP }) => {
    try {
        const newRsgp = await RSGP.create({
            nro_rsg,
            fecha_rsg,
            documento_RSGP,
        });
        return newRsgp || null;
    } catch (error) {
        console.error('Error creating RSGP:', error);
       return false
    }
};

const updateRsgpController = async ({ id, nro_rsg, fecha_rsg, documento_RSGP }) => {
    try {
        const updated = await RSGP.update(
            { nro_rsg, fecha_rsg, documento_RSGP },
            { where: { id } }
        );
       
        return updated || null
    } catch (error) {
        console.error('Error updating RSGP:', error);
        return false
    }
};

const getRsgpController = async (id) => {
    try {
        const rsgp = await RSGP.findByPk(id);
        if (!rsgp) throw new Error('RSGP not found');
        return rsgp;
    } catch (error) {
        console.error('Error fetching RSGP:', error);
        return false
    }
};

const getAllRsgpController = async () => {
    try {
        const rsgpList = await RSGP.findAll();
        return rsgpList;
    } catch (error) {
        console.error('Error fetching RSGPs:', error);
        return false
    }
};

module.exports = {
    createRsgpController,
    updateRsgpController,
    getRsgpController,
    getAllRsgpController
};
