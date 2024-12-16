const {getAllRSAforAnalista4Controller, getRsaController, updateRsaController} = require("../controllers/rsaController");
const {createDescargoRSAController} = require("../controllers/descargoRsaController");
const { getRSGController, getAllRSGforGerenciaController } = require("../controllers/rsgController")
const { createRGController } = require("../controllers/rgController")
const {
  createDescargoRSGNPController,
  updateDescargoRSGNPController,
} = require('../controllers/descargoRsgnpController');
const { updateRSGNPController } = require('../controllers/rsgController')


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

const getAllRSGforGerenciaHandler = async (req, res) => {
  try {
    const response = await getAllRSGforGerenciaController();

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


const createRGHandler = async (req, res) => {
  const {id}=req.params;

  const { nro_rg, fecha_rg, fecha_notificacion, id_nc, id_gerente, tipo } = req.body;

  const errores = [];

  const documento_rg = req.files && req.files["documento_rg"] ? req.files["documento_rg"][0] : null;

  if (!nro_rg) errores.push('El campo nro_rg es obligatorio');

  if (!fecha_rg) errores.push('El campo fecha_rg es obligatorio');

  if (!tipo) errores.push('El campo tipo es obligatorio');

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!fechaRegex.test(fecha_rg)) {

      errores.push('El formato de la fecha debe ser YYYY-MM-DD');

  } else {

      const parsedFecha = new Date(fecha_rg);

      if (isNaN(parsedFecha.getTime())) {

          errores.push('Debe ser una fecha válida');
      }
  }
  if (!fecha_notificacion) errores.push('El campo fecha_notificacion es obligatorio');

  if (!fechaRegex.test(fecha_notificacion)) {

      errores.push('El formato de la fecha debe ser YYYY-MM-DD');

  } else {

      const parsedFecha = new Date(fecha_notificacion);

      if (isNaN(parsedFecha.getTime())) {
          
          errores.push('Debe ser una fecha válida');
      }
  }

  if (!documento_rg || documento_rg.length === 0) {

      errores.push("El documento_rg es requerido.");

  } else {
      if (documento_rg.length > 1) {

          errores.push("Solo se permite un documento_rg.");

      } else if (documento_rg.mimetype !== "application/pdf") {

          errores.push("El documento_rg debe ser un archivo PDF.");

      }
  }
  
  if (!id_gerente) errores.push('El campo id_gerente es requerido');

  if (!isValidUUID(id_gerente)) errores.push('El id_gerente debe ser una UUID');


  if (!id_nc) errores.push('El campo id_nc es requerido');

  if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');


  if (errores.length > 0) {

      if (documento_rg) {
          fs.unlinkSync(documento_rg.path);
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

      const newRG = await createRGController({
          nro_rg,
          fecha_rg,
          fecha_notificacion,
          documento_rg,
          id_nc,
          id_gerente,
          tipo
      });
      if (!newRG) {
          return res.status(201).json({ message: 'Error al crear RG', data: [] });
      }
      const id_rg = newRG.id;

      // const response = await updateRSGNPController(id, { id_rg })

      // if (!response) {
      //     return res.status(201).json({
      //         message: 'Error al crear el RG y al asociar con RSGNP',
      //         data: []
      //     });
      // }  
      const total_documentos = newRG.documento_rg;

      const nuevoModulo = "RESOLUCION GERENCIAL"

      await updateDocumento({ id_nc, total_documentos, nuevoModulo });

      return res.status(200).json({ message: "RG creado con éxito Y Asociado a RSGNP", data: newRG });
  } catch (error) {
      console.error("Error al crear RG:", error);
      return res.status(500).json({ message: "Error al crear RG", data: error });
  }
};



module.exports = {
    getAllRSGforGerenciaHandler,
    createRGHandler
};
