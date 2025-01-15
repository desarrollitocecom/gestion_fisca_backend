const { ConstanciaInexigibilidad } = require('../../../config/db_connection');
const { saveImage, deleteFile } = require('../../../utils/fileUtils')
const createActaController = async ({ nro_acta, fecha_acta, documento_ci, tipo, id_nc, id_analista_5 }) => {
  let documento_path;
  try {

    documento_path = saveImage(documento_ci, "Constancia de Inexigibilidad");

    const response = await ConstanciaInexigibilidad.create({
      nro_ci: nro_acta,
      fecha_ci: fecha_acta,
      documento_ci: documento_path,
      tipo,
      id_nc,
      id_analista_5,
    });
    return response || null;

  } catch (error) {
    if (documento_path) {
      deleteFile(documento_path);
    }
    console.error("Error al crear el Informe Final:", error);
    return false;
  }
}

module.exports = { createActaController };
