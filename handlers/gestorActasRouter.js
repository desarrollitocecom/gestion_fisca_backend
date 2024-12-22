const { getAllUsersforControlActasController } = require('../controllers/usuarioController');
const { createControlActaController, actasActualesHandlerController, updateControlActaController } = require('../controllers/controlActaController');

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
    const { nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector } = req.body;

    const errores = [];
    
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    const fecha_laburo = new Date().toISOString().split('T')[0];
    console.log(fecha_laburo);
    

    try {
        const newControlActa = await createControlActaController({
            fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector
        });
        if (!newControlActa) {
            return res.status(201).json({ message: 'Error al crear el Control de Acta', data: [] });
        }

        return res.status(200).json({ message: 'Se creo el control de Acta correctamente', data: newControlActa });

    } catch (error) {
        console.error("Error interno al crear el Control de Acta:", error);
        return res.status(500).json({ message: "Error interno al crear el Control de Acta", data: error });
    }
};



const actasActualesHandler = async (req, res) => {
  try {
    const response = await actasActualesHandlerController();

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



const updateControlActaHandler = async (req, res) => {
  const {id}=req.params;
  const { nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector } = req.body;

  const errores = [];
  
  if (errores.length > 0) {
      return res.status(400).json({
          message: 'Se encontraron los siguientes errores',
          data: errores
      });
  }

  const fecha_laburo = new Date().toISOString().split('T')[0];
  console.log(fecha_laburo);
  

  try {
      const newControlActa = await updateControlActaController(id, {
          fecha_laburo, nro_actas_inicio, observaciones_inicio, id_encargadoInicio, id_inspector
      });
      if (!newControlActa) {
          return res.status(201).json({ message: 'Error al crear el Control de Acta', data: [] });
      }

      return res.status(200).json({ message: 'Se creo el control de Acta correctamente', data: newControlActa });

  } catch (error) {
      console.error("Error interno al crear el Control de Acta:", error);
      return res.status(500).json({ message: "Error interno al crear el Control de Acta", data: error });
  }
};





module.exports = { getAllUsersforControlActasHandler, createControlActaHandler, actasActualesHandler, updateControlActaHandler };
