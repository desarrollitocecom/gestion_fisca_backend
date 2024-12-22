const {ControlActa, Usuario} = require('../db_connection');
const { Sequelize } = require('sequelize');

const createControlActaController=async ({fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector}) => {
    try {
        const response = await ControlActa.create({
          fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector
        });
        return response || null;
  
    } catch (error) {
      console.error("Error al crear el control de acta:", error);
      return false;
    }
}

const actasActualesHandlerController =async () => {
  try {
      const response = await ControlActa.findAll({
        where: { fecha_laburo: '2024-02-12' },
        attributes: [
            'id',
            [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
            'nro_actas_inicio'
        ],
        include: [
          {
              model: Usuario,
              as: 'usuarioInspector',
              attributes: []
          },

      ],
      });
      return response || null;

  } catch (error) {
    console.error("Error al crear el control de acta:", error);
    return false;
  }
}


module.exports = { createControlActaController, actasActualesHandlerController };
