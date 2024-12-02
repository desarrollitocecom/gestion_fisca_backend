
const {  
    createActaController
} = require('../controllers/actaController');
const {  
    getRsaController,
    updateRsaController
} = require('../controllers/rsaController');
const fs = require('node:fs');

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
const createActaHandler=async (req,res) => {

    const {id}=req.params;

    const {id_nc,id_Analista_5 } = req.body;

    const errores = [];

    const documento_Acta = req.files && req.files["documento_Acta"] ? req.files["documento_Acta"][0] : null;

    if (!id_Analista_5) errores.push('El campo id_Analista_5 es requerido');
    
    if (!isValidUUID(id_Analista_5)) errores.push('El id_Analista_5 debe ser una UUID');

    
    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!documento_Acta || documento_Acta.length === 0) {

        errores.push("El documento_Acta es requerido.");

    } else {

        if (documento_Acta.length > 1) {

            errores.push("Solo se permite un documento_Acta.");

        } else if (documento_Acta.mimetype !== "application/pdf") {

            errores.push("El documento_Acta debe ser un archivo PDF.");

        }
    }
    if (errores.length > 0) {
        
        if (documento_Acta) {

            fs.unlinkSync(documento_Acta.path);
            
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
        const newActa = await createActaController({ id_nc,documento_Acta ,id_Analista_5 });
       
        if (!newActa) {
            return res.status(201).json({
                message: 'Error al crear Acta',
                data: []
            });
        }
        const id_evaluar_rsa=newActa.id;

        const tipo="ACTA"
        
        const id_estado_RSA=3;

        const response=await updateRsaController(id,{id_evaluar_rsa,id_estado_RSA,tipo})

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear y asociar RSA',
                data: []
            });
        }
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
    createActaHandler
}