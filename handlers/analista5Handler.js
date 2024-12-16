const {getAllRSAforAnalista5Controller} = require("../controllers/rsaController");
const {createDescargoRSAController} = require("../controllers/descargoRsaController");
const { getRSGController, getAllRSGforAnalista4Controller } = require("../controllers/rsgController")
const {
  createDescargoRSGNPController,
  updateDescargoRSGNPController,
} = require('../controllers/descargoRsgnpController');

const { getAllRGforAnalista5Controller } = require("../controllers/rgController")
const { updateRSGNPController } = require('../controllers/rsgController')

updateRSGNPController
const {
  getInformeFinalController,
  updateInformeFinalController,
} = require("../controllers/informeFinalController");

const { getAllRSGforAnalista5Controller } = require("../controllers/rsgController")

const { updateDocumento } = require("../controllers/documentoController");

const { startJobForDocument } = require("../jobs/DescargoJob");

const fs = require("node:fs");
function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const getAllRSGforAnalista5Handler = async (req, res) => {
  try {
    // const response = await getAllRSGforAnalista5Controller();
    // const response = await getAllRSAforAnalista5Controller();
    const response = await getAllRGforAnalista5Controller();

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






module.exports = {
    getAllRSGforAnalista5Handler
};



