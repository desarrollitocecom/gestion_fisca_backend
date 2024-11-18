const {
    createRGController,
    updateRGController,
    getRGController,
    getAllRGController,
} = require('../controllers/rgController');

// Crear un registro RG
const createRGHandler = async (req, res) => {
    const { nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac}=req.body;
    try {
        const newRG = await createRGController({ nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac});
        if(!newRG)
        {
            return res.status(201).json({message:'Error al crear RG',data:[]})
        }
       return res.status(201).json({ message: "RG creado con éxito", data: newRG });
    } catch (error) {
        console.error("Error al crear RG:", error);
       return res.status(500).json({ message: "Error al crear RG", data: error});
    }
};

// Actualizar un registro RG
const updateRGHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac}=req.body;
    try {
        const updatedRG = await updateRGController({id,nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac});
        if (!updatedRG) {
            return res.status(201).json({ message: "RG no encontrado" });
        }
         return res.status(200).json({ message: "RG actualizado con éxito", data: updatedRG });
    } catch (error) {
        console.error("Error al actualizar RG:", error);
        return res.status(500).json({ message: "Error al actualizar RG", data: error });
    }
};

// Obtener un registro RG por ID
const getRGHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const rg = await getRGController(id);
        if (!rg) {
            return res.status(201).json({ message: "RG no encontrado" ,data:[]});
        }
        return res.status(200).json({ message: "RG  encontrado",data: rg });
    } catch (error) {
        console.error("Error al obtener RG:", error);
        return res.status(500).json({ message: "Error al obtener RG", data: error });
    }
};

// Obtener todos los registros RG
const getAllRGHandler = async (req, res) => {
    try {
        const rgs = await getAllRGController();
        if(!rgs){
            return res.status(201).json({message:'RGs no Encontrados',data:[]})
        }
        return res.status(200).json({ message:'RGs Encontrados',data: rgs });
    } catch (error) {
        console.error("Error al obtener RGs:", error);
         return res.status(500).json({ message: "Error al obtener RGs", data: error });
    }
};

module.exports = {
    createRGHandler,
    updateRGHandler,
    getRGHandler,
    getAllRGHandler
};
