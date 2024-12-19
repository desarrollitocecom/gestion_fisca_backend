const {getAllRSAforAnalista5Controller, updateRsaController} = require("../controllers/rsaController");
const { getAllRGforAnalista5Controller, updateRGController } = require("../controllers/rgController")
const { updateRSGNPController, getAllRSGforAnalista5Controller } = require('../controllers/rsgController')
const { createActaController } = require('../controllers/actaController')
const { getAllNCSeguimientoController } = require('../controllers/seguimientoController')

const { updateDocumento } = require("../controllers/documentoController");

const fs = require("node:fs");
function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const getAllRSAforAnalista5Handler = async (req, res) => {
  try {
    const response = await getAllRSAforAnalista5Controller();

    if (response.length === 0) {
      return res.status(200).json({
        message: "Ya no hay más IFIs",
        data: []
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


const getAllRSGforAnalista5Handler = async (req, res) => {
  try {
    const response = await getAllRSGforAnalista5Controller();

    if (response.length === 0) {
      return res.status(200).json({
        message: "Ya no hay más IFIs",
        data: []
      });
    }

    return res.status(200).json({
      message: "IFIs obtenidos correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener IFIs para AR1asdas:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los IFIsss." });
  }
};


const getAllRGforAnalista5Handler = async (req, res) => {
  try {
    const response = await getAllRGforAnalista5Controller();

    if (response.length === 0) {
      return res.status(200).json({
        message: "Ya no hay más IFIs",
        data: []
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


const createActaHandler = async (req, res) => {
  const {id}=req.params;
  const { 
      nro_acta, 
      fecha_acta,
      id_nc ,
      id_analista_5,
      tipo
  } = req.body;


  const documento_acta = req.files && req.files["documento_acta"] ? req.files["documento_acta"][0] : null;

  const errores = [];

  if (!nro_acta) errores.push('El campo nro_acta es requerido');

  if (typeof nro_acta !== 'string') errores.push('El nro_acta debe ser una cadena de texto');

  if (!fecha_acta) errores.push('El campo fecha_acta es requerido');

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!fechaRegex.test(fecha_acta)) {
      errores.push('El formato de la fecha debe ser YYYY-MM-DD');
  } else {

      const parsedFecha = new Date(fecha_acta);

      if (isNaN(parsedFecha.getTime())) {

          errores.push('Debe ser una fecha válida');

      }
  }


if (!id_analista_5) errores.push('El campo id_analista_5 es requerido');

if (!isValidUUID(id_analista_5)) errores.push('El id_analista_5 debe ser una UUID');

if (!id_nc) errores.push('El campo id_nc es requerido');

if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

  if (!documento_acta) {
      errores.push('El documento_acta es requerido');
  } else {
      if (documento_acta.mimetype !== 'application/pdf') {
          errores.push('El documento debe ser un archivo PDF');
      }
  }

  if (errores.length > 0) {
      if (documento_acta) {
          fs.unlinkSync(documento_acta.path); 
      }
      return res.status(400).json({
          message: 'Se encontraron los siguientes errores',
          data: errores
      });
  }

  try {
      const newActa = await createActaController({
          nro_acta, 
          fecha_acta, 
          documento_acta,
          tipo,
          id_nc,
          id_analista_5
        });
      
      // const get_id=await getInformeFinalController(id);
  
      // if(!get_id){

      //     return res.status(404).json({message:"No se encuentra id del IFI",data:[]})
      // }
      const total_documentos=newActa.documento_acta

      const nuevoModulo="DESCARGO INFORME FINAL INSTRUCTIVO"

      await updateDocumento({id_nc, total_documentos, nuevoModulo});



      const id_acta=newActa.id;
      let response;

      if(tipo == 'analista3') {
        response=await updateRsaController(id,{tipo:'TERMINADO'})
      }

      if(tipo == 'analista4') {
        response=await updateRSGNPController(id,{tipo:'TERMINADO'})
      }

      if(tipo == 'gerencia') {
        response=await updateRGController(id,{tipo:'TERMINADO', id_evaluar_rg: id_acta})
      }


      if (!response) {
          return res.status(400).json({
              message: 'Error al crear y asociar DescargoIFI',
              data: []
          });
      }
      
      return res.status(200).json({

          message: 'Acta creada con exito',
          
          data: response
      });

  } catch (error) {
      console.error('Error al crear y asociar DescargoIFI:', error);
      return res.status(500).json({
          message: 'Error al crear y asociar DescargoIFI',
          error: error.message
      });
  }
};



const seguimientoHandler = async (req, res) => {
  try {
    const response = await getAllNCSeguimientoController();

    if (response.length === 0) {
      return res.status(200).json({
        message: "Ya no hay más IFIs",
        data: []
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


module.exports = {
    getAllRSAforAnalista5Handler,
    getAllRSGforAnalista5Handler,
    getAllRGforAnalista5Handler,
    createActaHandler,
    seguimientoHandler
};



