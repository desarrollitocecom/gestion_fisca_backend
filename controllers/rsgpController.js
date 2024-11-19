const { RSGP } = require('../db_connection');
const {saveImage,deleteFile}=require('../utils/fileUtils')

const createRsgpController = async ({ nro_rsg, fecha_rsg, documento_RSGP }) => {
    try {
        const documento_path=saveImage(documento_RSGP,'Resolucion(RSGP)')       

        const newRsgp = await RSGP.create({
            nro_rsg,
            fecha_rsg,
            documento_RSGP:documento_path
        });
        return newRsgp || null;
    } catch (error) {
        console.error('Error creating RSGP:', error);
       return false
    }
};

const updateRsgpController = async ({ id, nro_rsg, fecha_rsg, documento_RSGP }) => {
    //console.log(id, nro_rsg, fecha_rsg, documento_RSGP);
    
    try {
        const documento_path=saveImage(documento_RSGP,'Resolucion(RSGP)')       

       
        const rsgp = await RSGP.findOne({ where: { id } });

        if (rsgp) {
            await rsgp.update({
                nro_rsg,
                fecha_rsg,
                documento_RSGP:documento_path
            });
        }
        return rsgp || null
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
