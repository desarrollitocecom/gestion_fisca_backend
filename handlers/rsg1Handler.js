const {
    createRSG1Controller,
    updateRSG1Controller,
    getRSG1Controller
} = require('../controllers/rsg1Controller');
const {
    updateinIfiController
} = require('../controllers/informeFinalController');

const createRSG1Handler = async (req, res) => {
    const { nro_resolucion, fecha_resolucion, documento } = req.body;
    try {
        console.log(nro_resolucion, fecha_resolucion, documento);

        const response = await createRSG1Controller({ nro_resolucion, fecha_resolucion, documento });
        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGS1',
                data: []
            })
        }
        return res.status(200).json({
            message: "RG1 creado  correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener estados RGS1:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los estados RSG1." });
    }

}
const updateRSG1Handler = async (req, res) => {
    const { id } = req.params;
    const { nro_resolucion, fecha_resolucion, documento } = req.body;
    try {
        const response = await updateRSG1Controller({ id, nro_resolucion, fecha_resolucion, documento });
        if (!response) {
            return res.status(201).json({ message: 'Error al  modificar', data: [] })
        }
        return res.status(201).json({ message: 'Se modifico correctamente', data: response })
    } catch (error) {
        console.error("Error al modificar RGS1:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener modificar RSG1." });
    }

};
const updateinIfiHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSG1 = "RSG1";
    try {
        const rsg1 = await getRSG1Controller(id);
        if (!rsg1) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSG1", data: [] })
        }
        const ifi = await updateinIfiController(uuid,vRSG1,rsg1.id);
        if (!ifi) {
            return res.status(201).json({ message: "No se pudo modificar el IFI", data: [] })
        }
      
       
       return res.status(200).json({ message: 'Nuevo IFI modificado', data: ifi })
    } catch (error) {
        console.error("Error al modificar IFI:", error);
       return res.status(500).json({ error: "Error interno del servidor al obtener modificar ifi." });
    }
}
module.exports = {
    createRSG1Handler,
    updateRSG1Handler,
    updateinIfiHandler
};