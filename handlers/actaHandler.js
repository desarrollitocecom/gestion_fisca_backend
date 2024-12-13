
const {  
    createActaController
} = require('../controllers/actaController');
const {  
    getAllRSAforAN5Controller,
    getRsaController,
    updateRsaController
} = require('../controllers/rsaController');
const {
    getAllRSGNPforAN5Controller,
    getRsgnpController,
    updateRsgnpController    
}=require('../controllers/rsgnpController');
const {
    getAllRGforAN5Controller,
    getRGController,
    updateRGController   
}=require('../controllers/rgController');

const { updateDocumento } = require('../controllers/documentoController');
const fs = require('node:fs');
const { response } = require('express');
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Valida los datos para crear un Acta.
 * @param {Object} req - Objeto de solicitud de Express.
 * @returns {Object} - Objeto con las propiedades `isValid` (booleano) y `errores` (array con mensajes de error).
 */
function validateActaData(req) {
    const { id_nc, id_Analista_5 } = req.body;
    const documento_Acta = req.files && req.files["documento_Acta"] ? req.files["documento_Acta"][0] : null;
    const errores = [];

    // Validación de id_Analista_5
    if (!id_Analista_5) errores.push('El campo id_Analista_5 es requerido');
    if (id_Analista_5 && !isValidUUID(id_Analista_5)) errores.push('El id_Analista_5 debe ser una UUID');

    // Validación de id_nc
    if (!id_nc) errores.push('El campo id_nc es requerido');
    if (id_nc && !isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    // Validación de documento_Acta
    if (!documento_Acta || !documento_Acta===0   ) {
        errores.push("El documento_Acta es requerido.");
    } else {
        if (documento_Acta.length > 1) {
            errores.push("Solo se permite un documento_Acta.");
        } else if (documento_Acta.mimetype !== "application/pdf") {
            errores.push("El documento_Acta debe ser un archivo PDF.");
        }
    }

    return {
        isValid: errores.length === 0,
        errores,
        id_nc,
        id_Analista_5,
        documento_Acta
    };
}
const getAllRsaRgRsgnp = async (req, res) => {
    try {
        // Ejecuta todas las promesas en paralelo
        const [rsaData, rsgnpData, rgData] = await Promise.all([
            getAllRSAforAN5Controller(),
            getAllRSGNPforAN5Controller(),
            getAllRGforAN5Controller()
        ]);

        // Combina los resultados en un solo objeto
        const result = {
            rsa: rsaData,
            rsgnp: rsgnpData,
            rg: rgData
        };

        // Envía la respuesta con los datos combinados
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ message: 'Error al obtener los datos', error: error.message });
    }
};
const createActainRGHandler=async (req,res) => {
    const { id } = req.params;

    const { isValid,id_Analista_5, id_nc, errores, documento_Acta } = validateActaData(req);

    if (!isValid) {
        if (documento_Acta && documento_Acta.path) {
            fs.unlinkSync(documento_Acta.path); // Elimina archivo si hubo errores
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }
    try {

        const get_id=await getRGController(id);

        if(!get_id){

            return res.status(404).json({message:"No se encuentra id del RSA",data:[]})
        }
        const ruta="ACTA/ACTA-RG";
        const newActa = await createActaController({ id_nc,documento_Acta ,id_Analista_5 },ruta);
       
        if (!newActa) {
            return res.status(201).json({
                message: 'Error al crear Acta',
                data: []
            });
        }
        const id_evaluar_rg=newActa.id;

        const tipo="ACTA DE CONSENTIMIENTO"
        
        const id_estado_RG=2;

        const response=await updateRGController(id,{id_evaluar_rg,id_estado_RG,tipo})

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar RG',
                data: []
            });
        }
        const total_documentos = newActa.documento_Acta;

        const nuevoModulo = "ACTA-RG"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });
        
        return res.status(200).json({
            message: 'Acta creado y asociado a RG correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear Acta:', error);

        return res.status(500).json({
            message: 'Error al crear Acta',
            error: error.message
        });
    }
}
const createActainRsgnpHandler=async (req,res) => {
    const { id } = req.params;

    const { isValid,id_Analista_5, id_nc, errores, documento_Acta } = validateActaData(req);

    if (!isValid) {
        if (documento_Acta && documento_Acta.path) {
            fs.unlinkSync(documento_Acta.path); // Elimina archivo si hubo errores
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }
    try {

        const get_id=await getRsgnpController(id);

        if(!get_id){

            return res.status(404).json({message:"No se encuentra id del RSA",data:[]})
        }
        const ruta="ACTA/ACTA-RSGNP";
        const newActa = await createActaController({ id_nc,documento_Acta ,id_Analista_5 },ruta);
       
        if (!newActa) {
            return res.status(201).json({
                message: 'Error al crear Acta',
                data: []
            });
        }
        const id_evaluar_rsgnp=newActa.id;

        const tipo="ACTA"
        
        const id_estado_RSGNP=4;
       
        const response=await updateRsgnpController(id,{id_evaluar_rsgnp,id_estado_RSGNP,tipo})

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar RSGNP',
                data: []
            });
        }
        const total_documentos = newActa.documento_Acta;

        const nuevoModulo = "ACTA-RSGNP"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        return res.status(200).json({
            message: 'Acta creado y asociado a RSGNP correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear Acta:', error);

        return res.status(500).json({
            message: 'Error al crear Acta',
            error: error.message
        });
    }
}
const createActainRSAHandler=async (req,res) => {

    const { id } = req.params;

    const { isValid,id_Analista_5, id_nc, errores, documento_Acta } = validateActaData(req);

    if (!isValid) {
        if (documento_Acta && documento_Acta.path) {
            fs.unlinkSync(documento_Acta.path); // Elimina archivo si hubo errores
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }
    try {

        const get_id=await getRsaController(id);

        if(!get_id){

            return res.status(404).json({message:"No se encuentra id del RSA",data:[]})
        }
        const ruta="ACTA/ACTA-RSA";

        const newActa = await createActaController({ id_nc,documento_Acta ,id_Analista_5 },ruta);
       
        if (!newActa) {
            return res.status(201).json({
                message: 'Error al crear Acta',
                data: []
            });
        }
        const id_evaluar_rsa=newActa.id;

        const tipo="ACTA"
        
        const id_estado_RSA=4;

        const response=await updateRsaController(id,{id_evaluar_rsa,id_estado_RSA,tipo})

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar RSA',
                data: []
            });
        }
        const total_documentos = newActa.documento_Acta;

        const nuevoModulo = "ACTA-RSA"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });
        
        return res.status(200).json({
            message: 'Acta creado y asociado a RSA correctamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear Acta:', error);

        return res.status(500).json({
            message: 'Error al crear Acta',
            error: error.message
        });
    }
}
module.exports={
    createActainRSAHandler,
    createActainRsgnpHandler,
    createActainRGHandler,
    getAllRsaRgRsgnp
}