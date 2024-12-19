const {getAllIFIforAR2Controller, getInformeFinalController, updateInformeFinalController} = require('../controllers/informeFinalController');
const {updateDocumento}=require('../controllers/documentoController');
const {createRSG2Controller, getAllRSG2forAR2Controller} = require('../controllers/rsg2Controller');
const {createRSAController, getRSAforAnalista3Controller} = require('../controllers/rsaController');
const {validateRSG2, validateRSA} = require('../validations/areaResolutiva2Validation')
const fs = require('node:fs');
const {responseSocket} = require('../utils/socketUtils')

const getAllIFIforAR2Handler = async (req, res) => {  

    try {
        const response = await getAllIFIforAR2Controller();
  
        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay más IFIs para el Area Resolutiva 2',
                data: []
            });
        }
  
        return res.status(200).json({
            message: "IFIs obtenidos correctamente para el Area Resolutiva 2",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para AR2 en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs para el AR2." });
    }
  };

const createRSG2Handler = async (req, res) => {
    const { id } = req.params;

    const existingIFI = await getInformeFinalController(id);

    if (!existingIFI) {
        return res.status(404).json({ message: "No existe este IFI para crear un RSG2", data: [] })
    }

    const { nro_resolucion2, fecha_resolucion, id_nc, id_AR2} = req.body;

    const errors = validateRSG2(req.body);

    const documento = req.files && req.files["documento"] ? req.files["documento"][0] : null;

    if (!documento || documento.length === 0) {
        errors.push("El documento es requerido.");
    } else {
        if (documento.length > 1) {
            errors.push("Solo se permite un documento.");
        } else if (documento.mimetype !== "application/pdf") {
            errors.push("El documento debe ser un archivo PDF.");
        }
    }

    if (errors.length > 0) {
        if (documento) {
            fs.unlinkSync(documento.path);
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errors',
            data: errors
        });
    }

    try {
        
        const newRsg2 = await createRSG2Controller({ nro_resolucion2, fecha_resolucion, documento, id_nc, id_AR2 });
        
        if (!newRsg2) {
            return res.status(404).json({ message: "Error al crear el RSG2 en el AR2", data: [] })
        }
 
        const response = await updateInformeFinalController(id, { id_evaluar: newRsg2.id, tipo: 'TERMINADO_RSG2' })

        if (!response) {
            return res.status(201).json({
                message: 'Error al crear el RGS2 en el handler',
                data: []
            });
        }

        await updateDocumento({ id_nc, total_documentos: newRsg2.documento, nuevoModulo: "RESOLUCION SUBGERENCIAL 2" });

        return res.status(200).json({
            message: "RSG2 creado correctamente",
            data: response,
        });

    } catch (error) {
        console.error("Error al crear RSG2 en el servidor:", error);
        return res.status(500).json({ error: "Error interno del servidor al crear RSG2." });
    }
};

const createRSAHandler = async (req, res) => {
    const { id } = req.params;
    const existingIFI = await getInformeFinalController(id);

    if (!existingIFI) {
        return res.status(404).json({ message: "El id del IFI no se encuentra", data: [] })
    }


    const { nro_rsa, fecha_rsa, fecha_notificacion, id_nc, id_AR2 } = req.body;

    const errors = validateRSA(req.body);

    const documento_RSA = req.files && req.files["documento_RSA"] ? req.files["documento_RSA"][0] : null;

        if (!documento_RSA || documento_RSA.length === 0) {
            errors.push("El documento_RSA es requerido.");

        } else {
            if (documento_RSA.length > 1) {
                errors.push("Solo se permite un documento_RSA.");

            } else if (documento_RSA.mimetype !== "application/pdf") {
                errors.push("El documento_RSA debe ser un archivo PDF.");
                
            }
        }

        if (errors.length > 0) {
            if (documento_RSA) {
                fs.unlinkSync(documento_RSA.path);
            }
            return res.status(400).json({
                message: 'Se encontraron los siguientes errors',
                data: errors
            });
        }

    try {
        
        const newRSA = await createRSAController({ nro_rsa, fecha_rsa, fecha_notificacion, documento_RSA, tipo: 'ANALISTA_3', id_nc, id_AR2 });

        if (!newRSA) {
            return res.status(404).json({ message: "Error al crear un RSA", data: [] });
        }

        await updateDocumento({ id_nc, total_documentos: newRSA.documento_RSA, nuevoModulo: "RESOLUCION SANCIONADORA ADMINISTRATIVA" });

        const response = await updateInformeFinalController(id, { id_evaluar: newRSA.id,tipo: 'TERMINADO'})

        if (response) {
            await responseSocket({id: newRSA.id, method: getRSAforAnalista3Controller, socketSendName: 'sendAnalista3', res});
        } else {
           res.status(400).json({
                message: 'Error al crear el RSA',
            });
        }

    } catch (error) {
        console.error('Error al crear el RSA en el servidor:', error);
        return res.status(500).json({ message: "Error en el RSA en el servidor", error });
    }
};

const getAllRSG2forAR2Handler = async (req, res) => {  

    try {
        const response = await getAllRSG2forAR2Controller();
  
        if (response.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más RSG2 para el AR2',
                data: []
            });
        }
  
        return res.status(200).json({
            message: "RSG2 obtenidos exitosamente en el AR2",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los RSG2 para el AR2 en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los RSG2 en el AR2." });
    }
};


module.exports = {
    getAllIFIforAR2Handler,
    createRSG2Handler,
    createRSAHandler,
    getAllRSG2forAR2Handler
}
