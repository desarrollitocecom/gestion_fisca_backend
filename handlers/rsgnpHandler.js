const {
    createRsgnpController,
    updateRsgnpController,
    getRsgnpController,
    getAllRsgnpController,
    
} = require("../controllers/rsgnpController");
const{
    updateinRsaController
}=require('../controllers/rsaController')

const updateinRsaHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSGNP= "RSGNP";
    try {
        const rsgnp = await getRsgnpController(id);
        if (!rsgnp) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSGNP", data: [] })
        }
        const Rsa = await updateinRsaController(uuid,vRSGNP,rsgnp.id);
        if (!Rsa) {
            return res.status(201).json({ message: "No se pudo modificar el RSGNP", data: [] })
        }
      
       
       return res.status(200).json({ message: 'Nuevo RSA modificado', data: Rsa })
    } catch (error) {
        console.error("Error al modificar RSGNP:", error);
       return res.status(500).json({ error: "Error interno del servidor al obtener modificar RSGNP." });
    }
}
const createRsgnpHandler = async (req, res) => {
    try {
        const { nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg } = req.body;
        
        const newRsgnp = await createRsgnpController({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg });
        if(!newRsgnp){
            return res.status(201).json({message:'No fue Creado con Exito',data:[]});
        }
       return res.status(200).json({message:'Creado con Exito',data:newRsgnp});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateRsgnpHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg } = req.body;
        if (!id || !nro_rsg || !fecha_rsg || !fecha_notificacion || !documento_RSGNP || !id_descargo_RSGNP || !id_rg) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const message = await updateRsgnpController({ id, nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg });
        return res.status(200).json({ message });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getRsgnpHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        const rsgnp = await getRsgnpController(id);
        return res.status(200).json(rsgnp);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllRsgnpHandler = async (req, res) => {
    try {
        const rsgnps = await getAllRsgnpController();
        return res.status(200).json(rsgnps);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createRsgnpHandler,
    updateRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
    updateinRsaHandler
};
