const {ControlActa, Usuario, TramiteInspector, RangoActa} = require('../db_connection');
const { Sequelize } = require('sequelize');

const createControlActaController=async ({numero_actas, id_inspector, observaciones_inicio, id_encargadoInicio, fecha_laburo}) => {
    try {
        const response = await RangoActa.create({
          numero_actas, id_inspector, observaciones_inicio, id_encargadoInicio, fecha_laburo, estado: 'INICIADO'
        });
        return response || null;
  
    } catch (error) {
      console.error("Error al crear el control de acta:", error);
      return false;
    }
}

// const actasActualesHandlerController =async (dia) => {
//   try {
//       const tramitesPorInspector = await TramiteInspector.findAll({
//         attributes: [
//           'id_inspector',
//           [Sequelize.fn('COUNT', Sequelize.col('id')), 'nro_actas_realizadas'],
//         ],
//         where: Sequelize.where(
//           Sequelize.fn('DATE', Sequelize.col('createdAt')),
//           dia
//         ),
//         group: ['id_inspector'],
//       });

//       const tramitesMap = tramitesPorInspector.reduce((acc, tramite) => {
//         // Verificar que 'nro_actas_realizadas' sea válido y convertir a número
//         const nroActasRealizadas = tramite.dataValues.nro_actas_realizadas || 0;
//         acc[tramite.dataValues.id_inspector] = parseInt(nroActasRealizadas, 10);
//         return acc;
//       }, {});

      

//       const response = await ControlActa.findAll({
//        // where: { fecha_laburo: dia },
//         attributes: [
//             'id',
//             [Sequelize.col('usuarioInspector.id'), 'id_inspector'],
//             [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
//             //'nro_actas_inicio',
//             //'observaciones_inicio',
//             //'nro_actas_realizadas',
//             //'observaciones_laburo',
//             //'nro_actas_entregadas',
//             //'observaciones_fin',
//             'estado'
//         ],
//         include: [
//           {
//               model: Usuario,
//               as: 'usuarioInspector',
//               attributes: []
//           },

//       ],
//       });

      

//       const result = response.map((acta) => {
//         const nroActasRealizadas =
//           tramitesMap[acta.dataValues.id_inspector] || 0; // Si no hay trámites, usar 0
//         return {
//           ...acta.dataValues,
//           nro_actas_realizadas: nroActasRealizadas,
//         };
//       });
//       // console.log(result);

//       return result || null;

//   } catch (error) {
//     console.error("Error al traer control de actas actuales:", error);
//     return false;
//   }
// }

const actasActualesHandlerController = async (dia) => {
  try {
    const response = RangoActa.findAll({
      where: {fecha_laburo: dia},
      attributes: [
        'id',
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
      ],
      include: [
         {
             model: Usuario,
             as: 'usuarioInspector',
             attributes: []
         },
         {
            model: ControlActa,
            as: 'controlActa', // Este alias debe coincidir con el definido en la asociación
            attributes: ['numero_acta', 'estado'], // Ajusta los atributos que necesitas
          },
      ]
    })

    return response
  } catch (error) {
    
  }
}

const getActaActualController = async (id) => {
  try {
    const response = RangoActa.findAll({
      where: {id},
      attributes: [
        'id', 'numero_actas', 'observaciones_inicio', 'observaciones_final', 'estado',
        [Sequelize.col('usuarioInspector.usuario'), 'inspector'],
        [Sequelize.col('usuarioEncargadoInicio.usuario'), 'usuarioEntregoActas']
      ],
      include: [
         {
             model: Usuario,
             as: 'usuarioInspector',
             attributes: []
         },
         {
            model: Usuario,
            as: 'usuarioEncargadoInicio',
            attributes: []
         },
         {
            model: ControlActa,
            as: 'controlActa', // Este alias debe coincidir con el definido en la asociación
            attributes: ['id', 'numero_acta', 'estado'], // Ajusta los atributos que necesitas
          },
      ]
    })

    return response
  } catch (error) {
    
  }
}


const updateControlActaController=async (id,{nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin}) => {
  try {
    console.log(id);
    
      const findActaControl = await getControlActa(id);
      console.log(findActaControl);
      
      const response = await findActaControl.update({
        nro_actas_realizadas, observaciones_laburo, nro_actas_entregadas, observaciones_fin, id_encargadoFin, estado: 'FINALIZADO'
      });
      return response || null;

  } catch (error) {
    console.error("Error al crear el control de acta:", error);
    return false;
  }
}


const getControlActa = async (id) => {
  try {
    console.log(id, 'asd');
    
      const findControlActa = await ControlActa.findOne({ 
          where: { id } 
      });

      return findControlActa || null;
  } catch (error) {
      console.error({ message: "Error al encontrar el Acta Control", data: error });
      return false;
  }
}

const updateActaInspector = async () => {

}

module.exports = { createControlActaController, actasActualesHandlerController, updateControlActaController, getActaActualController, updateActaInspector };
