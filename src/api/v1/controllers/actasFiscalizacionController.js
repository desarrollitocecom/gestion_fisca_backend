const { TramiteInspector } = require('../../../config/db_connection');
const getActasFiscalizacion = async () => {
  try {
    const response = await TramiteInspector.findAll({
        attributes: [
            'id', 'nro_acta', 'documento_acta', 'createdAt'
        ]
    });
    return response || null;

  } catch (error) {
    console.error("Error al obtener las Actas de Fiscalizacion:", error);
    return false;
  }
}

module.exports = { getActasFiscalizacion };