const {getAllRSAforAnalista3Controller, getRsaController, updateRsaController, getRSAforAR3Controller, getRSAforAnalista5Controller} = require("../controllers/rsaController");
const {createDescargoRSAController} = require("../controllers/descargoRsaController");

const { getIo } = require('../sockets'); 


const { updateDocumento } = require("../controllers/documentoController");



const fs = require("node:fs");
function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const getAllRSAforAnalista3Handler = async (req, res) => {
  try {
    const response = await getAllRSAforAnalista3Controller();

    if (response.length === 0) {
      return res.status(200).json({
        message: "Ya no hay más IFIs",
        data: []
      });
    }

    return res.status(200).json({
      message: "IFIs obtenidos correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener IFIs para AR1:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los IFIs." });
  }
};

const createDescargoRSAHandler = async (req, res) => {
    const io = getIo(); 

    const {id}=req.params;
    
    const { nro_descargo, fecha_descargo, id_nc, id_analista_3 } = req.body;
     const documento_DRSA = req.files && req.files["documento_DRSA"] ? req.files["documento_DRSA"][0] : null;

    const errores = [];

    if (!nro_descargo) errores.push('El campo nro_descargo es requerido');
    
    if (typeof nro_descargo !== 'string') errores.push('El nro_descargo debe ser una cadena de texto');


    if (!fecha_descargo) errores.push('El campo fecha_descargo es requerido');
    
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha_descargo)) {

        errores.push('El formato de la fecha debe ser YYYY-MM-DD');

    } else {

        const parsedFecha = new Date(fecha_descargo);

        if (isNaN(parsedFecha.getTime())) {

            errores.push('Debe ser una fecha válida');

        }
    }
    
    if (!id_analista_3) errores.push('El campo id_analista_3 es requerido');
    
    if (!isValidUUID(id_analista_3)) errores.push('El id_analista_3 debe ser una UUID');

    
    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!documento_DRSA || documento_DRSA.length === 0) {

        errores.push("El documento_DRSA es requerido.");

    } else {

        if (documento_DRSA.length > 1) {

            errores.push("Solo se permite un documento_DRSA.");

        } else if (documento_DRSA.mimetype !== "application/pdf") {

            errores.push("El documento_DRSA debe ser un archivo PDF.");

        }
    }

    if (errores.length > 0) {
        
        if (documento_DRSA) {

            fs.unlinkSync(documento_DRSA.path);
            
        }

        return res.status(400).json({

            message: 'Se encontraron los siguientes errores',

            data: errores
        });
    }

    try {

        const existingRSA=await getRsaController(id);

        if(!existingRSA){

            return res.status(404).json({message:"No se encuentra RSA",data:[]})
        }
        const newDescargoRSA = await createDescargoRSAController({ nro_descargo, fecha_descargo, documento_DRSA, id_nc, id_estado: 1, id_analista_3 });
       
        if (!newDescargoRSA) {
            return res.status(201).json({
                message: 'Error al crear DescargoRSA',
                data: []
            });
        }
        const id_descargo_RSA=newDescargoRSA.id;

        const id_estado_RSA=3;

        const response=await updateRsaController(id,{id_descargo_RSA,id_estado_RSA,tipo:'AR3'})
            
        const total_documentos = newDescargoRSA.documento_DRSA;

        const nuevoModulo = "RECURSO DE RECONCIDERACION"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });


        if (response) {

            const findNC = await getRSAforAR3Controller(response.id);
            const plainNC = findNC.toJSON();

            io.emit("sendAR3", { data: [plainNC] });

            res.status(201).json({
                message: 'Descargo NC creado con exito',
                data: [findNC]
            });
        } else {
           res.status(400).json({
                message: 'Error al crear Descargo NC',
            });
        }
    } catch (error) {
        console.error('Error al crear DescargoRSA:', error);

        return res.status(500).json({
            message: 'Error al crear DescargoRSA',
            error: error.message
        });
    }
};

const sendWithoutDescargoRSAHandler = async (req, res) => {
    const io = getIo(); 
    const {id}=req.params;
    
    const { id_nc, id_analista_3 } = req.body;

    const errores = [];
    
    if (!id_analista_3) errores.push('El campo id_analista_3 es requerido');
    
    if (!isValidUUID(id_analista_3)) errores.push('El id_analista_3 debe ser una UUID');

    
    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (errores.length > 0) {

        return res.status(400).json({

            message: 'Se encontraron los siguientes errores',

            data: errores
        });
    }

    try {

        const existingRSA=await getRsaController(id);

        if(!existingRSA){

            return res.status(404).json({message:"No se encuentra RSA",data:[]})
        }
        const newDescargoRSA = await createDescargoRSAController({ id_nc, id_estado: 2, id_analista_3 });
       
        if (!newDescargoRSA) {
            return res.status(201).json({
                message: 'Error al crear DescargoRSA',
                data: []
            });
        }
        const id_descargo_RSA=newDescargoRSA.id;

        const id_estado_RSA=3;

        const response=await updateRsaController(id,{id_descargo_RSA,id_estado_RSA,tipo:'ANALISTA_5'})
  
        const total_documentos = '';

        const nuevoModulo = "RECURSO DE RECONCIDERACION"

        await updateDocumento({ id_nc, total_documentos, nuevoModulo });

        if (response) {

            const findNC = await getRSAforAnalista5Controller(response.id);
            const plainNC = findNC.toJSON();

            io.emit("sendAnalita5fromAnalista3", { data: [plainNC] });

            res.status(201).json({
                message: 'Descargo NC creado con exito',
                data: [findNC]
            });
        } else {
           res.status(400).json({
                message: 'Error al crear Descargo NC',
            });
        }


    } catch (error) {
        console.error('Error al crear DescargoRSA:', error);

        return res.status(500).json({
            message: 'Error al crear DescargoRSA',
            error: error.message
        });
    }
};



module.exports = {
    getAllRSAforAnalista3Handler,
    createDescargoRSAHandler,
    sendWithoutDescargoRSAHandler
};
