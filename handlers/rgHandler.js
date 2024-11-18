// const {
//     createRGController,
//     updateRGController,
//     getRGController,
//     getAllRGController,
// } = require('../controllers/rgController');

// // Crear un registro RG
// const createRGHandler = async (req, res) => {
//     const { nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac}=req.body;
//     try {
//         const newRG = await createRGController({ nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac});
//         if(!newRG)
//         {
//             return res.status(201).json({message:'Error al crear RG',data:[]})
//         }
//        return res.status(201).json({ message: "RG creado con éxito", data: newRG });
//     } catch (error) {
//         console.error("Error al crear RG:", error);
//        return res.status(500).json({ message: "Error al crear RG", data: error});
//     }
// };

// // Actualizar un registro RG
// const updateRGHandler = async (req, res) => {
//     const { id } = req.params;
//     const { nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac}=req.body;
//     try {
//         const updatedRG = await updateRGController({id,nro_rg,fecha_rg,fecha_notificacion,documento_rg,estado,documento_ac});
//         if (!updatedRG) {
//             return res.status(201).json({ message: "RG no encontrado" });
//         }
//          return res.status(200).json({ message: "RG actualizado con éxito", data: updatedRG });
//     } catch (error) {
//         console.error("Error al actualizar RG:", error);
//         return res.status(500).json({ message: "Error al actualizar RG", data: error });
//     }
// };

// // Obtener un registro RG por ID
// const getRGHandler = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const rg = await getRGController(id);
//         if (!rg) {
//             return res.status(201).json({ message: "RG no encontrado" ,data:[]});
//         }
//         return res.status(200).json({ message: "RG  encontrado",data: rg });
//     } catch (error) {
//         console.error("Error al obtener RG:", error);
//         return res.status(500).json({ message: "Error al obtener RG", data: error });
//     }
// };

// // Obtener todos los registros RG
// const getAllRGHandler = async (req, res) => {
//     try {
//         const rgs = await getAllRGController();
//         if(!rgs){
//             return res.status(201).json({message:'RGs no Encontrados',data:[]})
//         }
//         return res.status(200).json({ message:'RGs Encontrados',data: rgs });
//     } catch (error) {
//         console.error("Error al obtener RGs:", error);
//          return res.status(500).json({ message: "Error al obtener RGs", data: error });
//     }
// };
const {
    createRGController,
    updateRGController,
    getRGController,
    getAllRGController
} = require('../controllers/rgController');

// Crear un registro RG
const createRGHandler = async (req, res) => {
    const { nro_rg, fecha_rg, fecha_notificacion, estado } = req.body;
    const errores = [];
    const documento_rg = req.files["documento_rg"][0];
    const documento_ac = req.files["documento_ac"][0];

    // Validación de campos obligatorios
    if (!nro_rg) errores.push('El campo nro_rg es obligatorio');
    if (!fecha_rg) errores.push('El campo fecha_rg es obligatorio');
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_rg)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rg);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es obligatorio');
    if (!fechaRegex.test(fecha_notificacion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }
    if (!estado) errores.push('El campo estado es obligatorio');
    
    // Validación de archivos
    if (!documento_rg) errores.push('El archivo documento_rg es obligatorio');
    if (documento_rg && documento_rg.mimetype !== 'application/pdf') {
        errores.push('El archivo documento_rg debe ser un PDF');
    }
    
    if (documento_ac && documento_ac.mimetype !== 'application/pdf') {
        errores.push('El archivo documento_ac debe ser un PDF');
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const newRG = await createRGController({ 
            nro_rg, 
            fecha_rg, 
            fecha_notificacion, 
            estado, 
            documento_rg,
            documento_ac
        });
        
        if (!newRG) {
            return res.status(201).json({ message: 'Error al crear RG', data: [] });
        }
        return res.status(200).json({ message: "RG creado con éxito", data: newRG });
    } catch (error) {
        console.error("Error al crear RG:", error);
        return res.status(500).json({ message: "Error al crear RG", data: error });
    }
};

// Actualizar un registro RG
const updateRGHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_rg, fecha_rg, fecha_notificacion, estado } = req.body;
    const errores = [];
    const documento_rg = req.files["documento_rg"][0];
    const documento_ac = req.files["documento_ac"][0];

    // Validación de campos obligatorios
    if (!nro_rg) errores.push('El campo nro_rg es obligatorio');
    if (!fecha_rg) errores.push('El campo fecha_rg es obligatorio');


   const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_rg)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rg);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es obligatorio');
    if (!fechaRegex.test(fecha_notificacion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }
    if (!estado) errores.push('El campo estado es obligatorio');

    // Validación de archivos
    if (documento_rg && documento_rg.mimetype !== 'application/pdf') {
        errores.push('El archivo documento_rg debe ser un PDF');
    }
    if (documento_ac && documento_ac.mimetype !== 'application/pdf') {
        errores.push('El archivo documento_ac debe ser un PDF');
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const updatedRG = await updateRGController({ 
            id, 
            nro_rg, 
            fecha_rg, 
            fecha_notificacion, 
            estado, 
            documento_rg, 
            documento_ac
        });
        
        if (!updatedRG) {
            return res.status(404).json({ message: "RG no encontrado" });
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
            return res.status(404).json({ message: "RG no encontrado", data: [] });
        }
        return res.status(200).json({ message: "RG encontrado", data: rg });
    } catch (error) {
        console.error("Error al obtener RG:", error);
        return res.status(500).json({ message: "Error al obtener RG", data: error });
    }
};

// Obtener todos los registros RG
const getAllRGHandler = async (req, res) => {
    try {
        const rgs = await getAllRGController();
        if (!rgs) {
            return res.status(404).json({ message: 'RGs no encontrados', data: [] });
        }
        return res.status(200).json({ message: 'RGs encontrados', data: rgs });
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
