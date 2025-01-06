const {getAllRSAforAR3Controller, getRsaController,  updateRsaController} = require("../controllers/rsaController");
const { createRSGController, getAllRSG3forAR3Controller, getRSGforAnalista4Controller } = require("../controllers/rsgController")
const { updateDocumento } = require("../controllers/documentoController");
const { areaResolutiva3Validation } = require("../validations/areaResolutiva3Validation")
const fs = require("node:fs");
const { getIo } = require('../../../sockets'); 


const getAllRSAforAR3Handler = async (req, res) => {
  try {
    const response = await getAllRSAforAR3Controller();
    
    
    if (response.length === 0) {
      return res.status(200).json({
        message: "No hay más RSA para el Area Resolutiva 3",
        data: []
      });
    }

    return res.status(200).json({
      message: "RSAs obtenidos correctamente para el Area Resolutiva 3",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener RSas para AR1:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los IFIs." });
  }
};


const createRSGHandler = async (req, res) => {
  const io = getIo();

  const invalidFields = await areaResolutiva3Validation(req.body, req.files, req.params);

  if (invalidFields.length > 0) {
    if (req.files['documento_RSG']) {
      fs.unlinkSync(req.files['documento_RSG'][0].path);
    }
    return res.status(400).json({
      message: 'Se encontraron los siguientes errores',
      data: invalidFields
    });
  }
  
  const { nro_rsg, fecha_rsg, fecha_notificacion, id_nc, id_AR3, tipo} = req.body;
  const { id } = req.params
  
  try {
      const newRSG = await createRSGController({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSG: req.files['documento_RSG'][0], id_nc, id_AR3, tipo });

      if (!newRSG) {
          return res.status(400).json({ message: 'No fue creado con éxito', data: [] });
      }

      let response;

      if(tipo == 'RSGP'){
        response = await updateRsaController(id, { id_evaluar_rsa: newRSG.id, id_RSG: newRSG.id, tipo: 'ARCHIVO_AR3' })
      }
      if(tipo == 'RSGNP'){
        response = await updateRsaController(id, { id_evaluar_rsa: newRSG.id, id_RSG: newRSG.id, tipo: 'TERMINADO' })
      }


      await updateDocumento({ id_nc, total_documentos: newRSG.documento_RSG, nuevoModulo: "RESOLUCION SUBGERENCIAL NO PROCEDENTE" });

      if (response) {
        
        const findNC = await getRSGforAnalista4Controller(newRSG.id);
        
        const plainNC = findNC.toJSON();  

        if(tipo == 'RSGNP'){
          io.emit("sendAnalista4", { data: [plainNC] });
        }
        io.emit("sendAR3", { id, remove: true });

        res.status(201).json({
            message: 'RSG creado con exito',
            data: [findNC]
        });
    } else {
       res.status(400).json({
            message: 'Error al crear RSG',
        });
    }
  
  } catch (error) {
      console.error("Error interno al crear el RSG:", error);

      return res.status(500).json({ error: error.message });

  }
};

const getAllRSG3forAR3Handler = async (req, res) => {  
  try {
      const response = await getAllRSG3forAR3Controller();

      if (response.length === 0) {
          return res.status(200).json({
              message: 'No hay más RSG3',
              data: []
          });
      }

      return res.status(200).json({
          message: "Error al obtener los RSG3",
          data: response,
      });
  } catch (error) {
      console.error("Error en el servidor al obtener los RSG3:", error);
      res.status(500).json({ error: "Error interno del servidor al obtener los RSG3." });
  }
};

module.exports = {
    getAllRSAforAR3Handler,
    createRSGHandler,
    getAllRSG3forAR3Handler
};
