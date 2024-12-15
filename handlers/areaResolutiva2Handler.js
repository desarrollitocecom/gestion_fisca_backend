const {getAllIFIforAR2Controller, getInformeFinalController, updateInformeFinalController} = require('../controllers/informeFinalController');
const {updateDocumento}=require('../controllers/documentoController');
const {createRSG2Controller} = require('../controllers/rsg2Controller');
const {createRSAController} = require('../controllers/rsaController');

const fs = require('node:fs');

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

const getAllIFIforAR2Handler = async (req, res) => {  
    const { page = 1, limit = 20 } = req.query;
    const errores = [];
  
    if (isNaN(page)) errores.push("El page debe ser un número");
    if (page <= 0) errores.push("El page debe ser mayor a 0");
    if (isNaN(limit)) errores.push("El limit debe ser un número");
    if (limit <= 0) errores.push("El limit debe ser mayor a 0");
  
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
  
    try {
        const response = await getAllIFIforAR2Controller(Number(page), Number(limit));
  
        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más IFIs',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
            });
        }
  
        return res.status(200).json({
            message: "IFIs obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para AR1:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs." });
    }
  };

  const createRSG2Handler = async (req, res) => {
    const { id } = req.params;

    const { nro_resolucion2, fecha_resolucion, id_nc, id_AR2} = req.body;

    const documento = req.files && req.files["documento"] ? req.files["documento"][0] : null;

    const errores = [];

    if (!nro_resolucion2) errores.push('El campo nro_resolucion2 es requerido');

    if (typeof nro_resolucion2 !== 'string') errores.push('El nro_resolucion2 debe ser una cadena de texto');

    if (!id_AR2) errores.push('El campo id_AR2 es requerido');

    if (!isValidUUID(id_AR2)) errores.push('El id_AR2 debe ser una UUID');

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

    if (!documento || documento.length === 0) {
        errores.push("El documento es requerido.");
    } else {
        if (documento.length > 1) {
            errores.push("Solo se permite un documento.");
        } else if (documento.mimetype !== "application/pdf") {
            errores.push("El documento debe ser un archivo PDF.");
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
        const existingIFI = await getInformeFinalController(id);

        if (!existingIFI) {
            return res.status(404).json({ message: "El IFI no se encuentra", data: [] })
        }

        const newRsg2 = await createRSG2Controller({ nro_resolucion2, fecha_resolucion, documento, id_nc, id_AR2 });
        
        if (!newRsg2) {
            return res.status(404).json({ message: "Error al crear el RSG2", data: [] })
        }
       
        const id_evaluar = newRsg2.id;
 
        const response = await updateInformeFinalController(id, { id_evaluar, tipo: 'TERMINADO' })

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGS2 y al asociar',
                data: []
            });
        }
        const total_documentos = newRsg2.documento;

        const nuevoModulo = "RESOLUCION SUBGERENCIAL 2"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });
        return res.status(200).json({
            message: "RSG2 creado correctamente y asociado a IFI",
            data: response,
        });
    } catch (error) {
        console.error("Error al crear RSG2:", error);
        return res.status(500).json({ error: "Error interno del servidor al crear RSG2." });
    }
};

const createRSAHandler = async (req, res) => {
    const { id } = req.params;

    const { nro_rsa, fecha_rsa, fecha_notificacion, id_nc, id_AR2 } = req.body;

    const documento_RSA = req.files && req.files["documento_RSA"] ? req.files["documento_RSA"][0] : null;

    const errores = [];

    if (!nro_rsa) errores.push('El campo nro_rsa es requerido');

    if (typeof nro_rsa !== 'string') errores.push('El nro_rsa debe ser una cadena de texto');

    if (!id_AR2) errores.push('El campo id_AR2 es requerido');

    if (!isValidUUID(id_AR2)) errores.push('El id_AR2 debe ser una UUID');

    if (!fecha_rsa) errores.push('El campo fecha_rsa es requerido');

    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_rsa)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_rsa);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }

    if (!fecha_notificacion) errores.push('El campo fecha_notificacion es requerido');

    if (!fechaRegex.test(fecha_notificacion)) {

        errores.push('El formato de la fecha de notificación debe ser YYYY-MM-DD');
    } else {
        const parsedFecha = new Date(fecha_notificacion);
        if (isNaN(parsedFecha.getTime())) {
            errores.push('Debe ser una fecha válida');
        }
    }

    if (!documento_RSA || documento_RSA.length === 0) {

        errores.push("El documento_RSA es requerido.");

    } else {

        if (documento_RSA.length > 1) {

            errores.push("Solo se permite un documento_RSA.");

        } else if (documento_RSA.mimetype !== "application/pdf") {

            errores.push("El documento_RSA debe ser un archivo PDF.");

        }
    }

    if (errores.length > 0) {

        if (documento_RSA) {

            fs.unlinkSync(documento_RSA.path);

        }
        return res.status(400).json({

            message: 'Se encontraron los siguientes errores',

            data: errores
        });
    }

    try {
        const existingIFI = await getInformeFinalController(id);

        if (!existingIFI) {
            return res.status(404).json({ message: "El id del IFI no se encuentra", data: [] })
        }

        const newRSA = await createRSAController({ nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo: 'ANALISTA_3', id_nc, id_AR2 });

        if (!newRSA) {
            return res.status(404).json({ message: "Error al crear un RSA", data: [] });
        }
        const total_documentos = newRSA.documento_RSA;

        const nuevoModulo = "RESOLUCION SANCIONADORA ADMINISTRATIVA"

            await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        const id_evaluar = newRSA.id;

        const response = await updateInformeFinalController(id, { id_evaluar,tipo: 'TERMINADO'})

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGA y al asociar',
                data: []
            });
        }
        return res.status(200).json({ message: "RSA creada con éxito", data: response });

    } catch (error) {

        console.error('Error en createRsaHandler:', error);

        return res.status(500).json({ message: "Error en el handler", error });

    }
};

module.exports = {
    getAllIFIforAR2Handler,
    createRSG2Handler,
    createRSAHandler
}
