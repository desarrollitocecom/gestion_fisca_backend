const { getAllUsersforControlActasController } = require('../controllers/usuarioController');
const { createControlActaController, actasActualesHandlerController, updateControlActaController, getActaActualController } = require('../controllers/controlActaController');
const { format } = require('date-fns-tz');
const {ControlActa, Usuario, TramiteInspector, RangoActa} = require('../db_connection');
const { Sequelize } = require('sequelize');
const getAllUsersforControlActasHandler = async (req, res) => {
    try {
      const response = await getAllUsersforControlActasController();
  
      if (response.length === 0) {
        return res.status(200).json({
          message: "No existen Usuarios asignados a Inspectores",
          data: []
        });
      }
  
      return res.status(200).json({
        message: "Usuarios inspectores obtenidos correctamente",
        data: response,
      });
  
    } catch (error) {
      console.error("Error interno al obtener Usuarios Inspectores:", error);
      res
        .status(500)
        .json({ error: "Error interno del servidor al obtener los usuarios Inspectores." });
    }
};

const createControlActaHandler = async (req, res) => {
    const { numero_actas, id_inspector, observaciones_inicio, id_encargadoInicio } = req.body;

    console.log("numero_actas", numero_actas, "id_inspector", id_inspector,"observaciones_inicio", observaciones_inicio,"id_encargadoInicio", id_encargadoInicio)


    const errores = [];
    
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    const fecha_laburo = format(new Date(), 'yyyy-MM-dd', {
        timeZone: 'America/Lima',
    });
    

    try {
        const newControlActa = await createControlActaController({
          numero_actas, id_inspector, observaciones_inicio, id_encargadoInicio, fecha_laburo
        });
        if (!newControlActa) {
            return res.status(201).json({ message: 'Error al crear el Control de Acta', data: [] });
        }

        const fecha = getLocalDate();

        const actasConRangoId = req.body.actas.map(acta => ({
            ...acta,
            id_inspector: id_inspector,
            fecha,
            id_rangoActa: newControlActa.id,
            estado: 'ENTREGADO'
        }));

        await ControlActa.bulkCreate(actasConRangoId);


        return res.status(200).json({ message: 'Se creo el control de Acta correctamente', data: newControlActa });

    } catch (error) {
        console.error("Error interno al crear el Control de Acta:", error);
        return res.status(500).json({ message: "Error interno al crear el Control de Acta", data: error });
    }
};


const getLocalDate = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000; // Offset en milisegundos
  const localTime = new Date(now.getTime() - offsetMs);
  return localTime.toISOString().split('T')[0];
};


const actasActualesHandler = async (req, res) => {
  try {
    let dia = req.query.dia || getLocalDate();

    console.log(dia);
    const response = await actasActualesHandlerController(dia);

    if (response.length === 0) {
      return res.status(200).json({
        message: "No hay Actas registradas en este dia",
        data: []
      });
    }

    return res.status(200).json({
      message: "Registro de Actas obtenidos correctamente",
      data: response,
    });

  } catch (error) {
    console.error("Error interno al obtener Registro de Actas:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los Registro de Actas." });
  }
};





const getActaActualHandler = async (req, res) => {
  const {id} = req.params;
  console.log(id);

  try {
    const response = await getActaActualController(id);

    if (response.length === 0) {
      return res.status(200).json({
        message: "No existe esta acta",
        data: []
      });
    }

    return res.status(200).json({
      message: "Acta encontrada",
      data: response,
    });
  } catch (error) {
    
  }
  
}





const updateControlActaHandler = async (req, res) => {
  const {id}=req.params;
  const { observaciones_final, id_encargadoFin, actas } = req.body;

  const errores = [];
  
  if (errores.length > 0) {
      return res.status(400).json({
          message: 'Se encontraron los siguientes errores',
          data: errores
      });
  }

  const fecha_laburo = new Date().toISOString().split('T')[0];

  try {
    const controlActa = await RangoActa.findByPk(id);
    
    if (!controlActa) {
        return res.status(404).json({ message: "Control de Acta no encontrado" });
    }
    
    await controlActa.update({
        observaciones_final,
        id_encargadoFin,
        estado: 'FINALIZADO'
    });
    // Actualizar los registros hijos (Actas)
    for (const acta of actas) {
        const actaExistente = await ControlActa.findByPk(acta.id);
        if (!actaExistente) {
            return res.status(404).json({
                message: `El acta con ID ${acta.id} no fue encontrada`,
            });
        }

        await actaExistente.update({
            descripcion: acta.descripcion,
            estado: acta.estado,
        });
    }

    return res.status(200).json({
        message: "Control de Acta y sus Actas actualizadas correctamente",
    });
  } catch (error) {
      console.error("Error interno al actualizar el Control de Acta:", error);
      return res.status(500).json({
          message: "Error interno al actualizar el Control de Acta",
          data: error,
      });
  }



};





module.exports = { getAllUsersforControlActasHandler, createControlActaHandler, actasActualesHandler, getActaActualHandler, updateControlActaHandler };
