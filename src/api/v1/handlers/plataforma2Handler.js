const { createDescargoNC } = require('../controllers/ncDescargoController');
const { updateNC, getNC, getAllNCforAnalista, getNCforInstructiva } = require('../controllers/ncController');
const { updateDocumento } = require('../controllers/documentoController');
const fs = require('fs');
const { analista1DescargoValidation, analista1SinDescargoValidation } = require('../validations/analista1Validation');
const { responseSocket } = require('../../../utils/socketUtils')
const { getAllRSAforPlataformaController } = require('../controllers/rsaController')
const { getAllRSG2forPlataformaController } = require('../controllers/rsg2Controller')
const { createRecursoApelacionController } = require('../controllers/recursoApelacionController')
const { createRecursoReconsideracionController } = require('../controllers/recursoReconsideracionController')
const { updateResolucionSancionadoraController } = require('../controllers/resolucionSancionadora')
const { updateResolucionSubgerencialController } = require('../controllers/resolucionSubgerencial')
const { getAllRSGforPlataformaController, updateRSGController } = require('../controllers/rsgController')
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

  const { nro_recurso, fecha_recurso, id_nc, id_plataforma2, tipo_viene, tipo_va } = req.body;
  const { id } = req.params

  try {

    let recurso
    if (tipo_va == 'RECONSIDERACION') {
      recurso = await createRecursoReconsideracionController({ nro_recurso, fecha_recurso, id_nc, id_plataforma2, /* documento_recurso: req.files['documento_Recurso'][0]  */ });

      if (tipo_viene == 'RSA') {

        const response = await updateResolucionSancionadoraController(id, { tipo_evaluar: 'RECURSO_RECONC', id_evaluar_rsa: recurso.id })

        res.status(200).json({
          message: response,
        });
      }
      if (tipo_viene == 'RSG') {
        const response = await updateResolucionSubgerencialController(id, { tipo_evaluar: 'RECURSO_RECONC', id_evaluar_rsg: recurso.id })

        res.status(200).json({
          message: response,
        });
      }
    }
    if (tipo_va == 'APELACION') {
      recurso = await createRecursoApelacionController({ nro_recurso, fecha_recurso, id_nc, id_plataforma2, /* documento_recurso: req.files['documento_Recurso'][0]*/ });

      if (tipo_viene == 'RSA') {
        const response = await updateResolucionSancionadoraController(id, { tipo_evaluar: 'RECURSO_APELAC', id_evaluar_rsa: recurso.id })

        res.status(200).json({
          message: response,
        });
      }
      if (tipo_viene == 'RSG') {
        const response = await updateResolucionSubgerencialController(id, { tipo_evaluar: 'RECURSO_APELAC', id_evaluar_rsg: recurso.id })

        res.status(200).json({
          message: response,
        });
      }
      if (tipo_viene == 'RSG2') {
        const response = await updateRSGController(id, { id_recurso_apelacion: recurso.id })

        res.status(200).json({
          message: response,
        });
      }
    }


    // res.status(200).json({
    //   message: 'fino',
    // });

    // if (!asd) {
    //   return res.status(400).json({
    //     message: "Error al crear el Descargo RSGNP",
    //     data: []
    //   });
    // }

    // const response = await update(id, { id_descargo_RSG: newDescargo.id, id_estado_RSGNP: 3, tipo: 'GERENCIA' })

    // await updateDocumento({ id_nc, total_documentos: newDescargo.documento_DRSG, nuevoModulo: "RECURSO DE APELACION" });

    // if (response) {
    //   await responseSocket({ id, method: getRSGforGerenciaController, socketSendName: 'sendGerencia', res });
    //   io.emit("sendAnalista4", { id, remove: true });
    // } else {
    //   res.status(400).json({
    //     message: 'Error al crear Descargo RSGNP',
    //   });
    // }

  } catch (error) {
    console.error("Error interno al crear el descargo RSGNP:", error);
    return res.status(500).json({ message: "Error interno al crear el descargo RSGNP", error: error.message });
  }
}


module.exports = { getAllRSAforPlataformaHandler, getAllRSG2forPlataformaHandler, getAllDataForPlataformaHandler, createRecursoAdministrativoHandler, getAllRSGforPlataformaHandler };
