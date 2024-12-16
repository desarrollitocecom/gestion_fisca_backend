const {getAllRSAforAnalista4Controller, getRsaController, updateRsaController} = require("../controllers/rsaController");
const {createDescargoRSAController} = require("../controllers/descargoRsaController");
const { getRSGController, getAllRSGforAnalista4Controller } = require("../controllers/rsgController")
const {
  createDescargoRSGNPController,
  updateDescargoRSGNPController,
} = require('../controllers/descargoRsgnpController');
const { updateRSGNPController } = require('../controllers/rsgController')

updateRSGNPController
const {
  getInformeFinalController,
  updateInformeFinalController,
} = require("../controllers/informeFinalController");

const { updateDocumento } = require("../controllers/documentoController");

const { startJobForDocument } = require("../jobs/DescargoJob");

const fs = require("node:fs");
function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const getAllRSGforAnalista4Handler = async (req, res) => {
  try {
    const response = await getAllRSGforAnalista4Controller();

    if (response.data.length === 0) {
      return res.status(200).json({
        message: "Ya no hay más IFIs",
        data: {
          data: [],
        },
      });
    }

    return res.status(200).json({
      message: "IFIs obtenidos correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener IFIs para AR1:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los IFIs." });
  }
};



const createDescargoRSGNPHandler = async (req, res) => {
  const {id}=req.params;

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

  if (!isValidUUID(id_analista_4)) errores.push('El id_analista_4 debe ser una UUID');

  if (!id_nc) errores.push('El campo id_nc es requerido');

  if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

  
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
     
      const existingRSG=await getRSGController(id);

      if(!existingRSG){

          return res.status(404).json({message:"No se encuentra id del RSGNP",data:[]})
      }
      const newDescargo = await createDescargoRSGNPController({ nro_descargo, fecha_descargo, documento_DRSGNP, id_nc, id_analista_4 });
     
      if (!newDescargo) {

          return res.status(400).json({ 
              message: "Descargo no fue creado",
              data: [] });
      }
      const id_descargo_RSG=newDescargo.id;

      const id_estado_RSGNP=3;
   
      const response=await updateRSGNPController(id,{id_descargo_RSG,id_estado_RSGNP,tipo:'GERENCIA'})

      if (!response) {
          return res.status(400).json({
              message: 'Error al crear y asociar DescargoRSGNP',
              data: []
          });
      }
      
      const total_documentos = newDescargo.documento_DRSG;

      const nuevoModulo = "RECURSO DE APELACION"
      console.log(id_nc, total_documentos, nuevoModulo);
      
      await updateDocumento({ id_nc, total_documentos, nuevoModulo });

      return res.status(200).json({ message: "DescargoRSGNP creado con éxito y asociado a RSGNP correctamente", data: response });

  } catch (error) {

      console.error("Error al crear el descargo:", error);

      return res.status(500).json({ message: "Error al crear el descargo", error: error.message });
  }
};


const sendWithoutDescargoRSGNPHandler = async (req, res) => {
  const {id}=req.params;

  const { id_nc, id_analista_4 } = req.body;

  const errores = [];  
  
 
  if (!id_analista_4) errores.push('El campo id_analista_4 es requerido');

  if (!isValidUUID(id_analista_4)) errores.push('El id_analista_4 debe ser una UUID');

  if (!id_nc) errores.push('El campo id_nc es requerido');

  if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');


  if (errores.length > 0) {
      return res.status(400).json({
          message: 'Se encontraron los siguientes errores',
          data: errores
      });
  }

  try {
     
      const existingRSG=await getRSGController(id);

      if(!existingRSG){

          return res.status(404).json({message:"No se encuentra id del RSGNP",data:[]})
      }
      const newDescargo = await createDescargoRSGNPController({ id_nc, id_analista_4 });
     
      if (!newDescargo) {

          return res.status(400).json({ 
              message: "Descargo no fue creado",
              data: [] });
      }
      const id_descargo_RSG=newDescargo.id;

      const id_estado_RSGNP=3;
   
      const response=await updateRSGNPController(id,{id_descargo_RSG,id_estado_RSGNP,tipo:'ANALISTA_5'})

      if (!response) {
          return res.status(400).json({
              message: 'Error al crear y asociar DescargoRSGNP',
              data: []
          });
      }
      
      const total_documentos = '';

      const nuevoModulo = "RECURSO DE APELACION"
      console.log(id_nc, total_documentos, nuevoModulo);
      
      await updateDocumento({ id_nc, total_documentos, nuevoModulo });

      return res.status(200).json({ message: "DescargoRSGNP creado con éxito y asociado a RSGNP correctamente", data: response });

  } catch (error) {

      console.error("Error al crear el descargo:", error);

      return res.status(500).json({ message: "Error al crear el descargo", error: error.message });
  }
};





module.exports = {
    getAllRSGforAnalista4Handler,
    createDescargoRSGNPHandler,
    sendWithoutDescargoRSGNPHandler
};
