const {
    createRsgnpController,
    updateRsgnpController,
    getRsgnpController,
    getAllRsgnpController,

} = require("../controllers/rsgnpController");
const {
    updateinRsaController
} = require('../controllers/rsaController')

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
const updateinRsaHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSGNP = "RSGNP";
    const errores = []
    if (!uuid) errores.push('El campo es requerido')
    if (!isValidUUID(uuid)) errores.push('Debe ser un tipo uuid')
    if (!id) errores.push('El campo es requerido')
    if (!isValidUUID(id)) errores.push('Debe ser un tipo uuid')
    if (errores > 0) {
        return res.status(404).json({
            message: 'Se Encontraron los siguientes Errores',
            data: errores
        })
    }

    try {
        const rsgnp = await getRsgnpController(id);
        if (!rsgnp) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSGNP", data: [] })
        }
        const Rsa = await updateinRsaController(uuid, vRSGNP, rsgnp.id);
        if (!Rsa) {
            return res.status(201).json({ message: "No se pudo modificar el RSGNP", data: [] })
        }


        return res.status(200).json({ message: 'Nuevo RSA modificado', data: Rsa })
    } catch (error) {
        console.error("Error al modificar RSGNP:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener modificar RSGNP." });
    }
}
// const createRsgnpHandler = async (req, res) => {
//     try {
//         const { nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg } = req.body;

//         const newRsgnp = await createRsgnpController({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg });
//         if(!newRsgnp){
//             return res.status(201).json({message:'No fue Creado con Exito',data:[]});
//         }
//        return res.status(200).json({message:'Creado con Exito',data:newRsgnp});
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// const updateRsgnpHandler = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg } = req.body;

//         const message = await updateRsgnpController({ id, nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg });
//         return res.status(200).json({ message });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// const getRsgnpHandler = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return res.status(400).json({ error: "ID is required" });
//         }
//         const rsgnp = await getRsgnpController(id);
//         return res.status(200).json(rsgnp);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// const getAllRsgnpHandler = async (req, res) => {
//     try {
//         const rsgnps = await getAllRsgnpController();
//         return res.status(200).json(rsgnps);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

const createRsgnpHandler = async (req, res) => {
    const { nro_rsg, fecha_rsg, fecha_notificacion, id_descargo_RSGNP, id_rg } = req.body;
    const errores = [];
    const documento_RSGNP = req.files["documento"][0];
    // Validaciones de `nro_rsg`
    if (!nro_rsg) errores.push('El campo nro_rsg es requerido');
    if (typeof nro_rsg !== 'string') errores.push('El nro_rsg debe ser una cadena de texto');

    // Validaciones de `fecha_rsg`
    if (!fecha_rsg) errores.push('El campo fecha_rsg es requerido');
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_rsg)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsg);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida para fecha_rsg');
        }
    }

    // Validaciones de `fecha_notificacion`
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es requerido');
    if (!fechaRegex.test(fecha_notificacion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD para fecha_notificacion');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida para fecha_notificacion');
        }
    }

    // Validaciones de `documento_RSGNP`
    if (!documento_RSGNP) errores.push('El campo documento_RSGNP es requerido');
    else if (documento_RSGNP.mimetype !== 'application/pdf') errores.push('El documento_RSGNP debe ser un archivo PDF');

    // Validaciones de `id_descargo_RSGNP` y `id_rg`
    if (!id_descargo_RSGNP) errores.push('El campo id_descargo_RSGNP es requerido');
    if (!id_rg) errores.push('El campo id_rg es requerido');

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const newRsgnp = await createRsgnpController({ nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg });
        if (!newRsgnp) {
            return res.status(400).json({ message: 'No fue creado con éxito', data: [] });
        }
        return res.status(201).json({ message: 'Creado con éxito', data: newRsgnp });
    } catch (error) {
        console.error("Error al crear RSGNP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const updateRsgnpHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_rsg, fecha_rsg, fecha_notificacion, id_descargo_RSGNP, id_rg } = req.body;
    const documento_RSGNP = req.files["documento"][0];
    const errores = [];

    // Validaciones de `nro_rsg`
    if (!nro_rsg) errores.push('El campo nro_rsg es requerido');
    if (typeof nro_rsg !== 'string') errores.push('El nro_rsg debe ser una cadena de texto');

    // Validaciones de `fecha_rsg`
    if (!fecha_rsg) errores.push('El campo fecha_rsg es requerido');
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_rsg)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsg);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida para fecha_rsg');
        }
    }

    // Validaciones de `fecha_notificacion`
    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es requerido');
    if (!fechaRegex.test(fecha_notificacion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD para fecha_notificacion');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida para fecha_notificacion');
        }
    }

    // Validaciones de `documento_RSGNP`
    if (documento_RSGNP && documento_RSGNP.mimetype !== 'application/pdf') {
        errores.push('El documento_RSGNP debe ser un archivo PDF');
    }

    // Validaciones de `id_descargo_RSGNP` y `id_rg`
    if (!id_descargo_RSGNP) errores.push('El campo id_descargo_RSGNP es requerido');
    if (!id_rg) errores.push('El campo id_rg es requerido');

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const message = await updateRsgnpController({ id, nro_rsg, fecha_rsg, fecha_notificacion, documento_RSGNP, id_descargo_RSGNP, id_rg });
        return res.status(200).json({ message });
    } catch (error) {
        console.error("Error al modificar RSGNP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getRsgnpHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const rsgnp = await getRsgnpController(id);
        if (!rsgnp) {
            return res.status(404).json({ message: 'RSGNP no encontrado' });
        }
        return res.status(200).json(rsgnp);
    } catch (error) {
        console.error("Error al obtener RSGNP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getAllRsgnpHandler = async (req, res) => {
    try {
        const rsgnps = await getAllRsgnpController();
        return res.status(200).json(rsgnps);
    } catch (error) {
        console.error("Error al obtener todos los RSGNP:", error);
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createRsgnpHandler,
    updateRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
    updateinRsaHandler
};
