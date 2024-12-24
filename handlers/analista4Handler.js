const { getRSGController, getAllRSGforAnalista4Controller, getRSGforGerenciaController, getRSGforAnalista5Controller, updateRSGNPController } = require("../controllers/rsgController")
const {createDescargoRSGNPController} = require('../controllers/descargoRsgnpController');
const { updateDocumento } = require("../controllers/documentoController");
const { responseSocket } = require("../utils/socketUtils")
const fs = require("node:fs");
const { getIo } = require("../sockets");


const getAllRSGforAnalista4Handler = async (req, res) => {
    try {
        const response = await getAllRSGforAnalista4Controller();

        if (response.length === 0) {
        return res.status(200).json({
            message: "Ya no hay más RSG para el Analista 4",
            data: [],
        });
        }

        return res.status(200).json({
        message: "RSGs obtenidos correctamente para el Analista 4",
        data: response,
        });
    } catch (error) {
        console.error("Error en el servidor al obtener los RSGs para el Analista 4:", error);
        res
        .status(500)
        .json({ error: "Error en el servidor al obtener los RSGs para el Analista 4." });
    }
};



const createDescargoRSGNPHandler = async (req, res) => {
  const io = getIo();
  const {id}=req.params;
  const existingRSG=await getRSGController(id);

  if(!existingRSG){
      return res.status(404).json({message:"Este RSGNP no existe",data:[]})
  }

  const { nro_descargo, fecha_descargo, id_nc, id_analista_4 } = req.body;

  const errores = [];

  const documento_DRSGNP = req.files && req.files["documento_DRSGNP"] ? req.files["documento_DRSGNP"][0] : null;
  
  
  if (!nro_descargo) errores.push('El campo nro_descargo es requerido');

  if (typeof nro_descargo !== 'string') errores.push('El nro_descargo debe ser una cadena de texto');

  if (!fecha_descargo) errores.push('El campo fecha_descargo es requerido');

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!fechaRegex.test(fecha_descargo)) {

      errores.push('El formato de la fecha debe ser YYYY-MM-DD para fecha_descargo');

  } else {

      const parsedFecha = new Date(fecha_descargo);

      if (isNaN(parsedFecha.getTime())) {

          errores.push('Debe ser una fecha válida para fecha_descargo');
      }
  }
 
  if (!id_analista_4) errores.push('El campo id_analista_4 es requerido');


  if (!id_nc) errores.push('El campo id_nc es requerido');


  
  if (!documento_DRSGNP || documento_DRSGNP.length === 0) {

      errores.push("El documento_DRSGNP es requerido.");

  } else {

      if (documento_DRSGNP.length > 1) {

          errores.push("Solo se permite un documento_DRSGNP.");

      } else if (documento_DRSGNP.mimetype !== "application/pdf") {

          errores.push("El documento_DRSGNP debe ser un archivo PDF.");
      }
  }

  if (errores.length > 0) {
      if (documento_DRSGNP) {
          fs.unlinkSync(documento_DRSGNP.path);
      }
      return res.status(400).json({
          message: 'Se encontraron los siguientes errores',
          data: errores
      });
  }

    try {
        const newDescargo = await createDescargoRSGNPController({ nro_descargo, fecha_descargo, documento_DRSGNP, id_nc, id_analista_4 });
        
            if(!newDescargo) {
                return res.status(400).json({ 
                    message: "Error al crear el Descargo RSGNP",
                    data: [] });
            }
    
        const response=await updateRSGNPController(id,{id_descargo_RSG: newDescargo.id,id_estado_RSGNP: 3,tipo:'GERENCIA'})

        await updateDocumento({ id_nc, total_documentos: newDescargo.documento_DRSG, nuevoModulo: "RECURSO DE APELACION" });

        if (response) {
            await responseSocket({id, method: getRSGforGerenciaController, socketSendName: 'sendGerencia', res});
            io.emit("sendAnalista4", { id, remove: true });
        } else {
        res.status(400).json({
                message: 'Error al crear Descargo RSGNP',
            });
        }

    } catch (error) {
        console.error("Error interno al crear el descargo RSGNP:", error);
        return res.status(500).json({ message: "Error interno al crear el descargo RSGNP", error: error.message });
    }
};


const sendWithoutDescargoRSGNPHandler = async (req, res) => {
  const io = getIo();
  const {id}=req.params;
  const existingRSG=await getRSGController(id);

  if(!existingRSG){
      return res.status(404).json({message:"No se encuentra id del RSGNP",data:[]})
  }

  const { id_nc, id_analista_4 } = req.body;

  const errores = [];  
  
  if (!id_analista_4) errores.push('El campo id_analista_4 es requerido');
  if (!id_nc) errores.push('El campo id_nc es requerido');

  if (errores.length > 0) {
      return res.status(400).json({
          message: 'Se encontraron los siguientes errores',
          data: errores
      });
  }

  try {
      const newDescargo = await createDescargoRSGNPController({ id_nc, id_analista_4 });
     
      if (!newDescargo) {
          return res.status(400).json({ 
              message: "Error al crear el sin Descargo RSGNP",
              data: [] });
      }

      const response=await updateRSGNPController(id,{id_descargo_RSG: newDescargo.id,id_estado_RSGNP: 3,tipo:'ANALISTA_5'})

      await updateDocumento({ id_nc, total_documentos: '', nuevoModulo: "RECURSO DE APELACION" });

        if (response) {
            await responseSocket({id, method: getRSGforAnalista5Controller, socketSendName: 'sendAnalita5fromAnalista4', res});
            io.emit("sendAnalista4", { id, remove: true });
        } else {
        res.status(400).json({
                message: 'Error al enviar al socket los datos',
            });
        }

  } catch (error) {
      console.error("Error al crear el descargo RSGNP:", error);
      return res.status(500).json({ message: "Error al crear el descargo RSNP", error: error.message });
  }
};

module.exports = {
    getAllRSGforAnalista4Handler,
    createDescargoRSGNPHandler,
    sendWithoutDescargoRSGNPHandler
};
