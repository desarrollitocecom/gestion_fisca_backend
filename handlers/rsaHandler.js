const {
    createRsaController,
    updateRsaController,
    getRsaController,
    getAllRsaController
} = require('../controllers/rsaController');
const{
    updateinIfiController
}=require('../controllers/informeFinalController')
// Handler para crear una nueva RSA
const createRsaHandler = async (req, res) => {
   const { nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA } = req.body;
   try {
       const response = await createRsaController({nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA});
       if (!response) {
           return res.status(400).json({ message: "Error al crear una RSA", data: [] });
       }
       return res.status(200).json({ message: "RSA creada con éxito", data: response });
   } catch (error) {
       console.error('Error en crateRsaHandler:', error);
       return res.status(500).json({ message: "Error en el handler", error });
   }
};

// Handler para actualizar una RSA existente
const updateRsaHandler = async (req, res) => {
   const { id } = req.params;
   const { nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA } = req.body;
   console.log(id, nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA);
   
   try {
       const response = await updateRsaController({id, nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo, id_evaluar_rsa, id_descargo_RSA});
       if (!response) {
           return res.status(201).json({ message: "Error al actializar el RSA",data:[] });
       }
       return res.status(200).json({ message: "RSA actualizada con éxito", data: response });
   } catch (error) {
       console.error('Error en updateRsaHandler:', error);
       return res.status(500).json({ message: "Error en el handler", error });
   }
};

// Handler para obtener una RSA por ID
const getRsaHandler = async (req, res) => {
   const { id } = req.params;
   try {
       const response = await getRsaController(id);
       if (!response) {
           return res.status(404).json({ message: "RSA no encontrada" });
       }
       return res.status(200).json({ message: "RSA obtenida con éxito", data: response });
   } catch (error) {
       console.error('Error en getRsaHandler:', error);
       return res.status(500).json({ message: "Error en el handler", error });
   }
};

// Handler para obtener todas las RSAs
const getAllRsaHandler = async (req, res) => {
   try {
       const response = await getAllRsaController();
       if (!response) {
           return res.status(404).json({ message: "No se encontraron RSAs" });
       }
       return res.status(200).json({ message: "RSAs obtenidas con éxito", data: response });
   } catch (error) {
       console.error('Error en getAllRsaHandler:', error);
       return res.status(500).json({ message: "Error en el handler", error });
   }
};
const updateinRSAHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSA= "RSA";
    try {
        const rsa = await getRsaController(id);
        if (!rsa) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSA", data: [] })
        }
        const ifi = await updateinIfiController(uuid,vRSA,rsa.id);
        if (!ifi) {
            return res.status(201).json({ message: "No se pudo modificar el IFI", data: [] })
        }
      
       
       return res.status(200).json({ message: 'Nuevo IFI modificado', data: ifi })
    } catch (error) {
        console.error("Error al modificar IFI:", error);
       return res.status(500).json({ error: "Error interno del servidor al obtener modificar ifi." });
    }
}
module.exports = {
    createRsaHandler,
    updateRsaHandler,
    getRsaHandler,
    getAllRsaHandler,
    updateinRSAHandler
};
