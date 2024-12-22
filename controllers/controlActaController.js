const {ControlActa} = require('../db_connection');
const createControlActaController=async ({fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargado, id_inspector}) => {
    try {
        const response = await ControlActa.create({
          fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargado, id_inspector
        });
        return response || null;
  
    } catch (error) {
      console.error("Error al crear el control de acta:", error);
      return false;
    }
}

module.exports = { createControlActaController };
