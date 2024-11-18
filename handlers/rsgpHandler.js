// const {
//     createRsgpController,
//     updateRsgpController,
//     getRsgpController,
//     getAllRsgpController
// } = require('../controllers/rsgpController');
// const {
//     updateinRsaController
// }=require('../controllers/rsaController');
// const createRsgpHandler = async (req, res) => {
//     try {
//         const { nro_rsg, fecha_rsg, documento_RSGP } = req.body;

//         const newRsgp = await createRsgpController({ nro_rsg, fecha_rsg, documento_RSGP });
//         return res.status(201).json(newRsgp);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// const updateRsgpHandler = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { nro_rsg, fecha_rsg, documento_RSGP } = req.body;

//         const message = await updateRsgpController({ id, nro_rsg, fecha_rsg, documento_RSGP });

//         return res.status(200).json({ message });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// const getRsgpHandler = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const rsgp = await getRsgpController(id);
//         return res.status(200).json(rsgp);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// const getAllRsgpHandler = async (req, res) => {
//     try {
//         const rsgpList = await getAllRsgpController();
//         return res.status(200).json(rsgpList);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };
const {
    createRsgpController,
    updateRsgpController,
    getRsgpController,
    getAllRsgpController
} = require('../controllers/rsgpController');
const {
    updateinRsaController
} = require('../controllers/rsaController');

const createRsgpHandler = async (req, res) => {
    const { nro_rsg, fecha_rsg } = req.body;
    const documento_RSGP = req.files["documento_RSGP"][0];
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
            errores.push('Debe ser una fecha válida');
        }
    }

    // Validaciones de `documento_RSGP`
    if (!documento_RSGP) {
        errores.push('El documento_RSGP es requerido');
    } else {
        if (documento_RSGP.mimetype !== 'application/pdf') {
            errores.push('El documento_RSGP debe ser un archivo PDF');
        }
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const newRsgp = await createRsgpController({ nro_rsg, fecha_rsg, documento_RSGP });
        if (newRsgp) {
            return res.status(201).json({
                message: 'Error al Crear RSGP',
                data: []
            })
        }
        return res.status(200).json({
            message: 'RSGP creado correctamente',
            data: newRsgp
        });
    } catch (error) {
        console.error("Error al crear RSGP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const updateRsgpHandler = async (req, res) => {
    const { id } = req.params;
    const { nro_rsg, fecha_rsg } = req.body;
    const documento_RSGP = req.files && req.files["documento_RSGP"] ? req.files["documento_RSGP"][0] : null;
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
            errores.push('Debe ser una fecha válida');
        }
    }

    // Validaciones de `documento_RSGP`
    if (documento_RSGP && documento_RSGP.mimetype !== 'application/pdf') {
        errores.push('El documento_RSGP debe ser un archivo PDF');
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const message = await updateRsgpController({ id, nro_rsg, fecha_rsg, documento_RSGP });
        if (!message) return res.status(201).json({ message: "Error al moficar", data: [] })
        return res.status(200).json({
            message: 'RSGP modificado correctamente',
            data: message
        });
    } catch (error) {
        console.error("Error al modificar RSGP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getRsgpHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const rsgp = await getRsgpController(id);
        if (!rsgp) {
            return res.status(201).json({ message: 'RSGP no encontrado' });
        }
        return res.status(200).json(rsgp);
    } catch (error) {
        console.error("Error al obtener RSGP:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getAllRsgpHandler = async (req, res) => {
    try {
        const rsgpList = await getAllRsgpController();
        if (!rsgpList) return res.status(201).json({ message: "Error al traer los RSGP", data: [] })
        return res.status(200).json({
            message: "Estos son los RSGP",
            data: rsgpList
        });
    } catch (error) {
        console.error("Error al obtener todos los RSGP:", error);
        return res.status(500).json({ error: error.message });
    }
};

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

const updateinRsaHandler = async (req, res) => {
    const { uuid, id } = req.body;
    const vRSGP = "RSGP";
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
        const rsgp = await getRsgpController(id);
        if (!rsgp) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSG1", data: [] })
        }
        const Rsa = await updateinRsaController(uuid, vRSGP, rsgp.id);
        if (!Rsa) {
            return res.status(201).json({ message: "No se pudo modificar el Rsa", data: [] })
        }


        return res.status(200).json({ message: 'Nuevo Rsa modificar', data: Rsa })
    } catch (error) {
        console.error("Error al modificar Rsa:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener modificar Rsa." });
    }
}
module.exports = {
    createRsgpHandler,
    updateRsgpHandler,
    getRsgpHandler,
    getAllRsgpHandler,
    updateinRsaHandler
};
