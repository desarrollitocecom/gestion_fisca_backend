

const {getAllRSAforAR3Controller, getRsaController,  updateRsaController} = require("../controllers/rsaController");
const { createRSGController } = require("../controllers/rsgController")
const {createDescargoRSAController} = require("../controllers/descargoRsaController");
const {
  getInformeFinalController,
  updateInformeFinalController,
} = require("../controllers/informeFinalController");

const { updateDocumento } = require("../controllers/documentoController");


const fs = require("node:fs");
function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const getAllRSAforAR3Handler = async (req, res) => {
  try {
    const response = await getAllRSAforAR3Controller();

    if (response.data.length === 0) {
      return res.status(200).json({
        message: "Ya no hay más IFIs",
        data: {
          data: [],
        },
      });
    }

    return res.status(200).json({
      message: "RSAs obtenidos correctamente",
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
  const { id } = req.params;

  const { nro_rsg, fecha_rsg, fecha_notificacion, id_nc, id_AR3, tipo} = req.body;

  const errores = [];

  const documento_RSG = req.files && req.files["documento_RSG"] ? req.files["documento_RSG"][0] : null;

  if (!nro_rsg) errores.push('El campo nro_rsg es requerido');

  if (!tipo) errores.push('El campo tipo es requerido');

  if (typeof nro_rsg !== 'string') errores.push('El nro_rsg debe ser una cadena de texto');

  if (!fecha_rsg) errores.push('El campo fecha_rsg es requerido');

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!fechaRegex.test(fecha_rsg)) {
      errores.push('El formato de la fecha debe ser YYYY-MM-DD');
  } else {
      const parsedFecha = new Date(fecha_rsg);
      if (isNaN(parsedFecha.getTime())) {
          errores.push('Debe ser una fecha válida para fecha_rsg');
      }
  }

  if (!id_AR3) errores.push('El campo id_AR3 es requerido');

  if (!isValidUUID(id_AR3)) errores.push('El id_AR3 debe ser una UUID');

  if (!id_nc) errores.push('El campo id_nc es requerido');

  if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

  if (!fecha_notificacion) errores.push('El campo fecha_notificacion es requerido');

  if (!fechaRegex.test(fecha_notificacion)) {
      errores.push('El formato de la fecha debe ser YYYY-MM-DD para fecha_notificacion');
  } else {
      const parsedFecha1 = new Date(fecha_notificacion);
      if (isNaN(parsedFecha1.getTime())) {
          errores.push('Debe ser una fecha válida para fecha_notificacion');
      }
  }

  if (errores.length > 0) {
      if (documento_RSG) {
          fs.unlinkSync(documento_RSG.path);
      }
      return res.status(400).json({
          message: 'Se encontraron los siguientes errores',
          data: errores
      });
  }


  try {
      const existingRSA = await getRsaController(id);

      if (!existingRSA) {
          return res.status(404).json({ message: "El id del RSA no se encuentra", data: [] })
      }

      const newRSG = await createRSGController({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSG, id_nc, id_AR3 });

      if (!newRSG) {
          return res.status(400).json({ message: 'No fue creado con éxito', data: [] });
      }
      const id_evaluar_rsa = newRSG.id;


      const response = await updateRsaController(id, { id_evaluar_rsa, tipo })

      if (!response) {
          return res.status(201).json({
              message: 'Error al crear el RGSNP y al asociar con RSA',
              data: []
          });
      }

      const total_documentos = newRSG.documento_RSGNP;

      const nuevoModulo = "RESOLUCION SUBGERENCIAL NO PROCEDENTE"

          await updateDocumento({ id_nc, total_documentos, nuevoModulo });

      return res.status(200).json({ message: 'RGSNP creado  con éxito y asociado con RSA', data: response });
  
  } catch (error) {
      console.error("Error al crear RSGNP:", error);

      return res.status(500).json({ error: error.message });

  }
};


module.exports = {
    getAllRSAforAR3Handler,
    createRSGHandler
};
