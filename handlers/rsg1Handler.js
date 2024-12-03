const {
    createRSG1Controller,
    updateRSG1Controller,
    getRSG1Controller
} = require('../controllers/rsg1Controller');
const {
    updateinIfiController,
    updateInformeFinalController,
    getInformeFinalController
} = require('../controllers/informeFinalController');
const fs = require('node:fs');
function isValidUUID(uuid1) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid1);
}
const createRSG1Handler = async (req, res) => {
    const { id } = req.params;

    const { nro_resolucion, fecha_resolucion, id_nc, id_AR1 } = req.body;

    const documento = req.files && req.files["documento"] ? req.files["documento"][0] : null;

    const errores = [];

    if (!nro_resolucion) errores.push('El campo nro_resolucion es requerido');

    if (typeof nro_resolucion !== 'string') errores.push('El nro_resolucion debe ser una cadena de texto');

    if (!id_AR1) errores.push('El campo id_AR1 es requerido');

    if (!isValidUUID(id_AR1)) errores.push('El id_AR1 debe ser una UUID');

    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!fecha_resolucion) errores.push('El campo fecha_resolucion es requerido');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_resolucion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_resolucion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }


    if (!documento) {
        errores.push('El documento es requerido');
    } else {
        if (documento.mimetype !== 'application/pdf') {
            errores.push('El documento debe ser un archivo PDF');
        }
    }

    if (errores.length > 0) {
        if (documento) {
            fs.unlinkSync(documento.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const get_id = await getInformeFinalController(id);
        
        if (!get_id) {
            return res.status(404).json({ message: "El id del IFI no se encuentra", data: [] })
        }
        
        const createRsg1 = await createRSG1Controller({ nro_resolucion, fecha_resolucion, documento, id_nc, id_AR1 });

        if (!createRsg1) {
            return res.status(404).json({ message: "Error al crear el RSG1", data: [] })
        }
       
        const id_evaluar = createRsg1.id;

        const tipo = "RSG1";

        const response = await updateInformeFinalController(id, { id_evaluar, tipo })

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGS1 y al asociar',
                data: []
            });
        }
        return res.status(200).json({
            message: "RSG1 creado correctamente y asociado a IFI",
            data: response,
        });
    } catch (error) {
        console.error("Error al crear RSG1:", error);
        return res.status(500).json({ error: "Error interno del servidor al crear RSG1." });
    }
};

const updateRSG1Handler = async (req, res) => {
    const { id } = req.params;
    const { nro_resolucion, fecha_resolucion, id_nc, id_AR1 } = req.body;
    const documento = req.files && req.files["documento"] ? req.files["documento"][0] : null;
    const errores = [];

    // Validaciones de `nro_resolucion`
    if (!nro_resolucion) errores.push('El campo nro_resolucion es requerido');
    if (typeof nro_resolucion !== 'string') errores.push('El nro_resolucion debe ser una cadena de texto');
    // Validaciones de `id_AR1`
    if (!id_AR1) errores.push('El campo id_AR1 es requerido');
    if (!isValidUUID(id_AR1)) errores.push('El id_AR1 debe ser una UUID');
    // Validaciones de `id_nc`
    if (!id_nc) errores.push('El campo id_nc es requerido');
    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');
    // Validaciones de `fecha_resolucion`
    if (!fecha_resolucion) errores.push('El campo fecha_resolucion es requerido');
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_resolucion)) {
        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_resolucion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }

    // Validaciones de `documento`
    if (!documento || documento.length === 0) {
        errores.push("El documento es requerido.");
    } else {
        if (documento.length > 1) {
            errores.push("Solo se permite un documento.");
        } else if (documento.mimetype !== "application/pdf") {
            errores.push("El documento debe ser un archivo PDF.");
        }
    }

    // Si hay errores, devolverlos
    if (errores.length > 0) {
        if (documento) {
            fs.unlinkSync(documento.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {
        const response = await updateRSG1Controller({ id, nro_resolucion, fecha_resolucion, documento, id_nc, id_AR1 });

        if (!response) {
            return res.status(400).json({ message: 'Error al modificar el RSG1', data: [] });
        }

        return res.status(200).json({ message: 'RSG1 modificado correctamente', data: response });
    } catch (error) {
        console.error("Error al modificar RSG1:", error);
        return res.status(500).json({ error: "Error interno del servidor al modificar RSG1." });
    }
};

const updateinIfiHandler = async (req, res) => {
    const { uuid, id } = req.body;

    const vRSG1 = "RSG1";
    const errores = []
    // console.log(uuid,id);

    if (!uuid) errores.push('El campo es requerido')

    if (!isValidUUID(uuid)) errores.push('Debe ser un tipo uuid')

    if (!id && id.trim() === '') errores.push('El campo es requerido')

    if (!isValidUUID(id)) errores.push('Debe ser un tipo uuid')

    if (errores > 0)
        return res.status(400).json({ message: 'Se Encontraron los siguientes Errores', data: errores })


    try {
        const rsg1 = await getRSG1Controller(id);
        if (!rsg1) {
            return res.status(201).json({ message: "No se ecuentra el ID en RSG1", data: [] })
        }
        const ifi = await updateinIfiController(uuid, vRSG1, rsg1.id);
        if (!ifi) {
            return res.status(201).json({ message: "No se pudo modificar el IFI", data: [] })
        }


        return res.status(200).json({ message: 'Nuevo IFI modificado', data: ifi })
    } catch (error) {
        console.error("Error al modificar IFI:", error);
        return res.status(500).json({ error: "Error interno del servidor al modificar ifi." });
    }
}
module.exports = {
    createRSG1Handler,
    updateRSG1Handler,
    updateinIfiHandler
};