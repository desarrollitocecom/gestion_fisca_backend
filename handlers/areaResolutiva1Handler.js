const {getAllIFIforAR1Controller, getInformeFinalController, updateInformeFinalController} = require('../controllers/informeFinalController');
const {createRSG1Controller, getAllRSG1forAR1Controller} = require('../controllers/rsg1Controller');
const {updateDocumento}=require('../controllers/documentoController');

const {validateAreaResolutiva1} = require('../validations/areaResolutiva1Validation')


const fs = require('node:fs');


const getAllIFIforAR1Handler = async (req, res) => {  

    try {
        const response = await getAllIFIforAR1Controller();
  
        if (response.length === 0) {
            return res.status(200).json({
                message: 'No hay IFIs para el Área Resolutiva',
                data: []
            });
        }
  
        return res.status(200).json({
            message: "Error al obtener IFIs para el área resolutiva en el handler",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener IFIs para AR1 en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los IFIs en el AR1" });
    }
};

const createRSG1Handler = async (req, res) => {
    const { id } = req.params;

    const existingIFI = await getInformeFinalController(id);
        
    if (!existingIFI) {
        return res.status(404).json({ message: "Este IFI no existe", data: [] })
    }

    const { nro_resolucion, fecha_resolucion, id_nc, id_AR1 } = req.body;

    const errors = validateAreaResolutiva1(req.body);

    const documento = req.files && req.files["documento"] ? req.files["documento"][0] : null;

    if (!documento) {
        errors.push('El documento es requerido');
    } else {
        if (documento.mimetype !== 'application/pdf') {
            errors.push('El documento debe ser un archivo PDF');
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

        const newRsg1 = await createRSG1Controller({ nro_resolucion, fecha_resolucion, documento, id_nc, id_AR1 });

        if (!newRsg1) {
            return res.status(404).json({ message: "Error al crear el RSG1 desde el handler", data: [] })
        }

        const response = await updateInformeFinalController(id, { tipo: 'TERMINADO_RSG1', id_evaluar: newRsg1.id })

        await updateDocumento({ id_nc, total_documentos: newRsg1.documento, nuevoModulo: "RESOLUCION SUBGERENCIAL 1" });

        if (!response) {
            return res.status(400).json({
                message: 'Error al crear el RGS1 en el handler',
                data: []
            });
        }
        return res.status(200).json({
            message: "RSG1 creado correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al crear RSG1 desde el servidor:", error);
        return res.status(500).json({ error: "Error interno del servidor al crear RSG1." });
    }
};

const getAllRSG1forAR1Handler = async (req, res) => {  

    try {
        const response = await getAllRSG1forAR1Controller();
  
        if (response.length === 0) {
            return res.status(200).json({
                message: 'No existen RSG1 creadas',
                data: []
            });
        }
  
        return res.status(200).json({
            message: "RSG1 obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener los RSG1 desde el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los RSG1s." });
    }
};


module.exports = {
    getAllIFIforAR1Handler,
    createRSG1Handler,
    getAllRSG1forAR1Handler
}
