const { getAllRSAforAR3Controller, getRsaController, updateRsaController } = require("../controllers/rsaController");
const { createRSGController, getAllRSG3forAR3Controller1, getAllRSG3forAR3Controller2, getRSGforAnalista4Controller, getAllRSGforSubgerenciaController, getAllRSG3forAR3Controller } = require("../controllers/rsgController")
const { updateDocumento } = require("../controllers/documentoController");
const { createCargoNotificacionController } = require("../controllers/cargoNotificacionController")
const { areaResolutiva3Validation } = require("../validations/areaResolutiva3Validation")
const { getAllRecursoReconsideracionesController, updateRecursoReconsideracionController } = require("../controllers/recursoReconsideracionController")
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

const getAllRecursoReconsideracionesHandler = async (req, res) => {
  try {
    const response = await getAllRecursoReconsideracionesController();


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
}


const createRSGHandler = async (req, res) => {
  const io = getIo();

  const { nro_rsg, fecha_rsg, id_nc, id_AR3, tipo } = req.body;
  const { id } = req.params

  try {

    const newCargoNotificacion = await createCargoNotificacionController({
      tipo: 'RSG2'
    });

    const newRSG = await createRSGController({ nro_rsg, fecha_rsg, id_nc, id_AR3, tipo, documento_RSG: req.files['documento_RSG'][0], id_cargoNotificacion: newCargoNotificacion.id });

    if (!newRSG) {
      return res.status(400).json({ message: 'No fue creado con éxito', data: [] });
    }
    await updateRecursoReconsideracionController(id, { id_original: newRSG.id, id_rsg: newRSG.id })

    let response;

    if (tipo == 'RSGP') {
      response = await updateRsaController(id, { id_evaluar_rsa: newRSG.id, id_RSG: newRSG.id, tipo: 'ARCHIVO_AR3' })
    }
    if (tipo == 'RSGNP') {
      response = await updateRsaController(id, { id_evaluar_rsa: newRSG.id, id_RSG: newRSG.id, tipo: 'TERMINADO' })
    }


    await updateDocumento({ id_nc, total_documentos: newRSG.documento_RSG, nuevoModulo: "RESOLUCION SUBGERENCIAL NO PROCEDENTE" });

    return res.status(200).json({
      message: "Subido Correctamente",
      data: response
    });

    // if (response) {

    //   const findNC = await getRSGforAnalista4Controller(newRSG.id);

    //   const plainNC = findNC.toJSON();

    //   res.status(200).json({
    //     message: 'LO LOGRAMOS',
    //   });
    //   // await responseSocket({ id: newRSA.id, method: getRSAforAnalista3Controller, socketSendName: 'sendAnalista3', res });

    //   // if(tipo == 'RSGNP'){
    //   //   io.emit("sendAnalista4", { data: [plainNC] });
    //   // }
    //   // io.emit("sendAR3", { id, remove: true });
    // }

  } catch (error) {
    console.error("Error interno al crear el RSG:", error);

    return res.status(500).json({ error: error.message });

  }
};


const createRSGRectificacionHandler = async (req, res) => {
  const io = getIo();

  const { nro_rsg, fecha_rsg, id_nc, id_AR3, tipo } = req.body;
  const { id } = req.params
  try {
    const newRSG = await createRSGController({ nro_rsg, fecha_rsg, id_nc, documento_RSG: req.files['documento_RSG'][0], id_AR3, tipo });

    if (!newRSG) {
      return res.status(400).json({ message: 'No fue creado con éxito', data: [] });
    }
    await updateRecursoReconsideracionController(id, { id_rsg: newRSG.id })

    let response;

    if (tipo == 'RSGP') {
      response = await updateRsaController(id, { id_evaluar_rsa: newRSG.id, id_RSG: newRSG.id, tipo: 'ARCHIVO_AR3' })
    }
    if (tipo == 'RSGNP') {
      response = await updateRsaController(id, { id_evaluar_rsa: newRSG.id, id_RSG: newRSG.id, tipo: 'TERMINADO' })
    }

    await updateDocumento({ id_nc, total_documentos: newRSG.documento_RSG, nuevoModulo: "RECTIFICACION DE RESOLUCION SUBGERENCIAL" });
    
    return res.status(200).json({
      message: 'Rectificacion Creada Exitosamente',
      data: []
    });
    // if (response) {
    //   console.log('7')
    //   // const findNC = await getRSGforAnalista4Controller(newRSG.id);

    //   // const plainNC = findNC.toJSON();

    //   // if (tipo == 'RSGNP') {
    //   //   io.emit("sendAnalista4", { data: [plainNC] });
    //   // }
    //   // io.emit("sendAR3", { id, remove: true });
      
    // }

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
            message: 'No existen más RG para gerencia',
            data: []
        });
    }

    return res.status(200).json({
        message: "RG obtenidos correctamente",
        data: response,
    });
} catch (error) {
    console.error("Error interno la obtener los RG para Gerencia:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener los RG para Gerencia." });
}
};


const getAllIRSGForSubgerenciaHandler = async (req, res) => {
  try {
    const response = await getAllRSGforSubgerenciaController();

    if (response.length === 0) {
      return res.status(200).json({
        message: 'No hay más IFIs para el Area Resolutiva 2',
        data: []
      });
    }

    return res.status(200).json({
      message: "IFIs obtenidos correctamente para el Area Resolutiva 2",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener IFIs para AR2 en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener los IFIs para el AR2." });
  }
}

module.exports = {
  getAllRSAforAR3Handler,
  createRSGHandler,
  getAllRSG3forAR3Handler,
  getAllRecursoReconsideracionesHandler,
  createRSGRectificacionHandler,
  getAllIRSGForSubgerenciaHandler
};
