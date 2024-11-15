const {
    createRSG2Controller,
    updateRSG2Controller,
    getRSG2Controller
} = require('../controllers/rsg2Controller');
const {
    updateinIfiController
} = require('../controllers/informeFinalController');
const createRSG2Handler = async (req, res) => {
    const { nro_resolucion2, fecha_resolucion, documento } = req.body;
    try {
        console.log(nro_resolucion2, fecha_resolucion, documento);

        const response = await createRSG2Controller({ nro_resolucion2, fecha_resolucion, documento });
        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGS2',
                data: []
            })
        }
        return res.status(200).json({
            message: "RGS2 creado  correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener estados RGS1:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los estados RSG2." });
    }

}
const updateRSG2Handler = async (req, res) => {
    const {id}=req.params;
    const {nro_resolucion2, fecha_resolucion, documento}=req.body;
    try {
        const response=await updateRSG2Controller({id,nro_resolucion2, fecha_resolucion, documento});
        if(!response){
            return res.status(201).json({message:'Error al  modificar',data:[]})
        }
        return res.status(201).json({message:'Se modifico correctamente',data:response})
    } catch (error) {
        console.error("Error al modificar RGS1:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener modificar RSG2." });
    }

};
const updateinIfiHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSG2 = "RSG2";
    try {
        const rsg2 = await getRSG2Controller(id);
        if (!rsg2) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSG2", data: [] })
        }
        const ifi = await updateinIfiController(uuid,vRSG2,rsg2.id);
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
    createRSG2Handler,
    updateRSG2Handler,
    updateinIfiHandler
};