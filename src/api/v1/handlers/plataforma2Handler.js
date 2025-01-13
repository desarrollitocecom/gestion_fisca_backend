const { createDescargoNC } = require('../controllers/ncDescargoController');
const { updateNC, getNC, getAllNCforAnalista, getNCforInstructiva } = require('../controllers/ncController');
const { updateDocumento } = require('../controllers/documentoController');
const fs = require('fs');
const { responseSocket } = require('../../../utils/socketUtils')
const { getAllRSAforPlataformaController } = require('../controllers/rsaController')
const { getAllRSG2forPlataformaController } = require('../controllers/rsg2Controller')
const { createRecursoApelacionController } = require('../controllers/recursoApelacionController')
const { createRecursoReconsideracionController } = require('../controllers/recursoReconsideracionController')
const { updateResolucionSancionadoraController } = require('../controllers/resolucionSancionadora')
const { updateResolucionSubgerencialController } = require('../controllers/resolucionSubgerencial')
const { getAllRSGforPlataformaController, updateRSGController } = require('../controllers/rsgController')
const { plataforma2Validation } = require('../validations/plataforma2Validation')
const { getIo } = require("../../../sockets");

const getAllRSAforPlataformaHandler = async (req, res) => {
  try {
    const response = await getAllRSAforPlataformaController();

    if (response.length === 0) {
      return res.status(200).json({
        message: 'No hay RSAs para Plataforma',
        data: []
      });
    }

    return res.status(200).json({
      message: "Lista para Plataforma obtenido correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error del servidor al traer la lista para el Analista 1:", error);
    res.status(500).json({ error: "Error del servidor al traer la lista para el Analista 1" });
  }
};

const getAllRSG2forPlataformaHandler = async (req, res) => {
  try {
    console.log('asdssss');

    const response = await getAllRSG2forPlataformaController();

    if (response.length === 0) {
      return res.status(200).json({
        message: 'No hay RSGs para Plataforma',
        data: []
      });
    }

    return res.status(200).json({
      message: "Lista para Plataforma obtenido correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error del servidor al traer la lista para el Analista 1:", error);
    res.status(500).json({ error: "Error del servidor al traer la lista para el Analista 1" });
  }
};

const getAllRSGforPlataformaHandler = async (req, res) => {
  try {
    const response = await getAllRSGforPlataformaController();

    if (response.length === 0) {
      return res.status(200).json({
        message: 'No hay RSGs para Plataforma',
        data: []
      });
    }

    return res.status(200).json({
      message: "Lista para Plataforma obtenido correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error del servidor al traer la lista para el Analista 1:", error);
    res.status(500).json({ error: "Error del servidor al traer la lista para el Analista 1" });
  }
};

const getAllDataForPlataformaHandler = async (req, res) => {
  try {
    // Ejecutar ambos controladores en paralelo
    const [rsaResponse, rsgResponse, rsg2Response] = await Promise.all([
      getAllRSAforPlataformaController(),
      getAllRSG2forPlataformaController(),
      getAllRSGforPlataformaController()
    ]);

    // Combinar las respuestas en un solo arreglo
    const combinedResponse = [
      ...rsaResponse,
      ...rsgResponse,
      ...rsg2Response
    ];

    if (combinedResponse.length === 0) {
      return res.status(200).json({
        message: 'No hay datos para Plataforma',
        data: []
      });
    }

    return res.status(200).json({
      message: 'Datos para Plataforma obtenidos correctamente',
      data: combinedResponse,
    });
  } catch (error) {
    console.error('Error del servidor al traer los datos para Plataforma:', error);
    return res.status(500).json({
      error: 'Error del servidor al traer los datos para Plataforma',
    });
  }
};

const createRecursoAdministrativoHandler = async (req, res) => {

  const io = getIo();

  const invalidFields = await plataforma2Validation(req.body, req.files, req.params);

  if (invalidFields.length > 0) {
    if (req.files['documento_Recurso']) {
      fs.unlinkSync(req.files['documento_Recurso'][0].path);
    }
    return res.status(400).json({
      message: 'Se encontraron los siguientes errores',
      data: invalidFields
    });
  }

  const { nro_recurso, fecha_recurso, id_nc, id_plataforma2, tipo_viene, tipo_va } = req.body;
  const { id } = req.params

  try {

    let recurso
    if (tipo_va == 'RECONSIDERACION') {
      recurso = await createRecursoReconsideracionController({ nro_recurso, fecha_recurso, id_nc, id_plataforma2, documento_recurso: req.files['documento_Recurso'][0] });

      if (tipo_viene == 'RSA') {

        const response = await updateResolucionSancionadoraController(id, { tipo_evaluar: 'RECURSO_RECONC', id_evaluar_rsa: recurso.id })

        return res.status(200).json({
          message: "Recurso Subido Correctamente",
          data: response
        });
      }
      if (tipo_viene == 'RSG') {
        const response = await updateResolucionSubgerencialController(id, { tipo_evaluar: 'RECURSO_RECONC', id_evaluar_rsg: recurso.id })

        return res.status(200).json({
          message: "Recurso Subido Correctamente",
          data: response
        });
      }
    }

    if (tipo_va == 'APELACION') {
      recurso = await createRecursoApelacionController({ nro_recurso, fecha_recurso, id_nc, id_plataforma2, documento_recurso: req.files['documento_Recurso'][0] });

      if (tipo_viene == 'RSA') {
        const response = await updateResolucionSancionadoraController(id, { tipo_evaluar: 'RECURSO_APELAC', id_evaluar_rsa: recurso.id })

        return res.status(200).json({
          message: "Recurso Subido Correctamente",
          data: response
        });
      }
      if (tipo_viene == 'RSG') {
        const response = await updateResolucionSubgerencialController(id, { tipo_evaluar: 'RECURSO_APELAC', id_evaluar_rsg: recurso.id })

        return res.status(200).json({
          message: "Recurso Subido Correctamente",
          data: response
        });
      }
      if (tipo_viene == 'RSG2') {
        const response = await updateRSGController(id, { id_recurso_apelacion: recurso.id })

        return res.status(200).json({
          message: "Recurso Subido Correctamente",
          data: response
        });
      }
    }

  } catch (error) {
    console.error("Error interno al crear el descargo RSGNP:", error);
    return res.status(500).json({ message: "Error interno al crear el descargo RSGNP", error: error.message });
  }
}


module.exports = { getAllRSAforPlataformaHandler, getAllRSG2forPlataformaHandler, getAllDataForPlataformaHandler, createRecursoAdministrativoHandler, getAllRSGforPlataformaHandler };
