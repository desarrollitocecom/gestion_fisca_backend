const { RSGP } = require('../db_connection');
const {saveImage,deleteFile}=require('../utils/fileUtils')

const createRsgpController = async ({ nro_rsg, fecha_rsg, documento_RSGP,id_nc,id_AR3 }) => {
    let documento_path;
    try {
         documento_path=saveImage(documento_RSGP,'Resolucion(RSGP)')       

        const newRsgp = await RSGP.create({
            nro_rsg,
            fecha_rsg,
            documento_RSGP:documento_path,
            id_nc,
            id_AR3
        });
        return newRsgp || null;
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
        console.error('Error creating RSGP:', error);
       return false
    }
};

const updateRsgpController = async ({ id, nro_rsg, fecha_rsg, documento_RSGP ,id_nc,id_AR3}) => {
    
    let documento_path;
    try {
       
        const rsgp = await RSGP.findOne({ where: { id } });
        documento_path=rsgp.documento_RSGP
        if (documento_RSGP) {
            documento_path = saveImage(documento_RSGP, 'Resolucion(RSGP)');
            if (rsgp.documento_RSGP) {
                deleteFile(rsgp.documento_RSGP);
            }
        }
        if (rsgp) {
            await rsgp.update({
                nro_rsg,
                fecha_rsg,
                documento_RSGP:documento_path,
                id_nc,
                id_AR3
            });
        }
        return rsgp || null
    } catch (error) {
        if (documento_path) {
            deleteFile(documento_path);
        }
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
