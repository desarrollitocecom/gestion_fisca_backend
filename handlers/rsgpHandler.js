const {
    createRsgpController,
    updateRsgpController,
    getRsgpController,
    getAllRsgpController
} = require('../controllers/rsgpController');
const {
    updateinRsaController
}=require('../controllers/rsaController');
const createRsgpHandler = async (req, res) => {
    try {
        const { nro_rsg, fecha_rsg, documento_RSGP } = req.body;
        if (!nro_rsg || !fecha_rsg || !documento_RSGP) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newRsgp = await createRsgpController({ nro_rsg, fecha_rsg, documento_RSGP });
        res.status(201).json(newRsgp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRsgpHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { nro_rsg, fecha_rsg, documento_RSGP } = req.body;
        if (!id || !nro_rsg || !fecha_rsg || !documento_RSGP) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const message = await updateRsgpController({ id, nro_rsg, fecha_rsg, documento_RSGP });
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRsgpHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        const rsgp = await getRsgpController(id);
        res.status(200).json(rsgp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllRsgpHandler = async (req, res) => {
    try {
        const rsgpList = await getAllRsgpController();
        res.status(200).json(rsgpList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateinRsaHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSGP= "RSGP";
    try {
        const rsgp = await getRsgpController(id);
        if (!rsgp) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSG1", data: [] })
        }
        const Rsa = await updateinRsaController(uuid,vRSGP,rsgp.id);
        if (!Rsa) {
            return res.status(201).json({ message: "No se pudo modificar el Rsa", data: [] })
        }
      
       
       return res.status(200).json({ message: 'Nuevo Rsa modificar', data: Rsa })
    } catch (error) {
        console.error("Error al modificar Rsa:", error);
       return res.status(500).json({ error: "Error interno del servidor al obtener modificar Rsa." });
    }
}
module.exports = {
    createRsgpHandler,
    updateRsgpHandler,
    getRsgpHandler,
    getAllRsgpHandler,
    updateinRsaHandler
};
