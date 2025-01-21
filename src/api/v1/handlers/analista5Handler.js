const { getAllRSAforAnalista5Controller, updateRsaController } = require("../controllers/rsaController");
const { getAllRGforAnalista5Controller, updateRGController } = require("../controllers/rgController")
const { updateRSGNPController, getAllRSGforAnalista5Controller } = require('../controllers/rsgController')
const { createActaController } = require('../controllers/actaController')
const { getAllNCSeguimientoController, getSeguimientoController } = require('../controllers/seguimientoController')
const { analista5Validation } = require("../validations/analista5Validation")

const { updateDocumento } = require("../controllers/documentoController");

const fs = require("node:fs");

const getAllRSAforAnalista5Handler = async (req, res) => {
  try {
    const response = await getAllRSAforAnalista5Controller();

    if (response.length === 0) {
      return res.status(200).json({
        message: "No hay más RSA para el Analista 5",
        data: []
      });
    }

    return res.status(200).json({
      message: "RSAs obtenidos correctamente para el Analista 5",
      data: response,
    });

  } catch (error) {
    console.error("Error interno al obtener RSAs para Analista 5:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los RSAs para el Analista 5." });
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
        message: "No hay más RG para el Analista 5",
        data: []
      });
    }

    return res.status(200).json({
      message: "RGs obtenidos correctamente para el Analista 5",
      data: response,
    });
  } catch (error) {
    console.error("Error interno al obtener RGs para Analista 5:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los RGs para el Analista 5." });
  }
};


const createActaHandler = async (req, res) => {

  const invalidFields = await analista5Validation(req.body, req.files, req.params);

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: 'Se encontraron los siguientes errores',
      data: invalidFields
    });
  }

  const {
    nro_acta, fecha_acta, id_nc, id_analista_5, tipo
  } = req.body;
  const { id } = req.params

  try {
    const newActa = await createActaController({
      nro_acta,
      fecha_acta,
      documento_ci: req.files['documento_acta'][0],
      tipo,
      id_nc,
      id_analista_5
    });

    // const get_id=await getInformeFinalController(id);

    // if(!get_id){

    //     return res.status(404).json({message:"No se encuentra id del IFI",data:[]})
    // }
    const total_documentos = newActa.documento_ci

    const nuevoModulo = "CONSTANCIA DE INEXIGIBILIDAD"

    console.log(id_nc, total_documentos, nuevoModulo);
    
    await updateDocumento({ id_nc, total_documentos, nuevoModulo });

    const id_acta = newActa.id;
    let response;

    if (tipo == 'analista3') {
      response = await updateRsaController(id, { tipo: 'TERMINADO' })
    }

    if (tipo == 'analista4') {
      response = await updateRSGNPController(id, { tipo: 'TERMINADO' })
    }

    if (tipo == 'gerencia') {
      response = await updateRGController(id, { tipo: 'TERMINADO', id_const_inexigibilidad: id_acta })
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
        message: "No exiten NCs para realizar su seguimiento",
        data: []
      });
    }

    return res.status(200).json({
      message: "NCs obtenidos correctamente para su seguimiento",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener NCs para Seguimiento:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los NCs para el seguimiento." });
  }
};



const getTrazabilidadHandler = async (req, res) => {
  const {id} = req.params

  try {
    const response = await getSeguimientoController(id);
    console.log(response)

    if (response.length === 0) {
      return res.status(200).json({
        message: "No exiten NCs para realizar su seguimiento",
        data: []
      });
    }

    return res.status(200).json({
      message: "NCs obtenidos correctamente para su seguimiento",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener NCs para Seguimiento:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los NCs para el seguimiento." });
  }
};








module.exports = {
  getAllRSAforAnalista5Handler,
  getAllRSGforAnalista5Handler,
  getAllRGforAnalista5Handler,
  createActaHandler,
  seguimientoHandler,
  getTrazabilidadHandler
};



