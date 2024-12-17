const fs = require('fs');
const { getAllIFIforAnalista2Controller, updateInformeFinalController, getInformeFinalController, getIFIforAR2Controller } = require('../controllers/informeFinalController');
const { createDescargoIFI } = require('../controllers/descargoInformeFinalController');
const {updateDocumento}=require('../controllers/documentoController');
const { getIo } = require('../sockets'); 


function isValidUUID(uuid1) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid1);
}

const getAllIFIforAnalista2Handler = async (req, res) => {  

    try {
        const response = await getAllIFIforAnalista2Controller();
  
        if (response.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más IFIs',
                data: []
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

const createDescargoIFIHandler = async (req, res) => {
    const io = getIo(); 

    const {id}=req.params;
    const { 
        nro_descargo, 
        fecha_descargo,
        id_nc ,
        id_analista_2
    } = req.body;

 
    const documento_DIFI = req.files && req.files["documento_DIFI"] ? req.files["documento_DIFI"][0] : null;

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


if (!id_analista_2) errores.push('El campo id_analista_2 es requerido');

if (!isValidUUID(id_analista_2)) errores.push('El id_analista_2 debe ser una UUID');

if (!id_nc) errores.push('El campo id_nc es requerido');

if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (!documento_DIFI) {
        errores.push('El documento_DIFI es requerido');
    } else {
        if (documento_DIFI.mimetype !== 'application/pdf') {
            errores.push('El documento debe ser un archivo PDF');
        }
    }

    if (errores.length > 0) {
        if (documento_DIFI) {
            fs.unlinkSync(documento_DIFI.path); 
        }
        return res.status(400).json({
            message: 'Se encontraron los siguientes errores',
            data: errores
        });
    }

    try {

        const existingIFI=await getInformeFinalController(id);

        if(!existingIFI){

            return res.status(404).json({message:"No se encuentra id del IFI",data:[]})
        }

        const newDescargoIFI = await createDescargoIFI({
            nro_descargo, 
            fecha_descargo, 
            documento_DIFI,
            id_nc,
            id_estado: 1,
            id_analista_2
        });

        const id_descargo_ifi=newDescargoIFI.id;


        const response = await updateInformeFinalController(id,{id_descargo_ifi,tipo:'AR2'})

        const total_documentos=newDescargoIFI.documento_DIFI

        const nuevoModulo="DESCARGO INFORME FINAL INSTRUCTIVO"

        await updateDocumento({id_nc, total_documentos, nuevoModulo});


        if (response) {

            const findNC = await getIFIforAR2Controller(response.id);
            const plainNC = findNC.toJSON();

            io.emit("sendAR2", { data: [plainNC] });

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
        console.error('Error al crear y asociar DescargoIFI:', error);
        return res.status(500).json({
            message: 'Error al crear y asociar DescargoIFI',
            error: error.message
        });
    }
};

const sendWithoutDescargoIFIHandler = async (req, res) => {
    const io = getIo(); 

    const id = req.params.id;

    const { 
        id_nc,
        id_analista_2,
    } = req.body;

    try {

        const existingIFI = await getInformeFinalController(id); 

        if (!existingIFI) {
            return res.status(404).json({ message: "IFI no encontrada para actualizar" });
        }

        const newDescargoIFI = await createDescargoIFI({ 
            id_nc,
            id_estado : 2,
            id_analista_2,
        });

        const id_descargo_ifi=newDescargoIFI.id;
        
        if (!newDescargoIFI) {
            return res.status(400).json({ error: 'Error al crear el Descargo IFI' });
        }
        
        const response = await updateInformeFinalController(id, { 
            id_descargo_ifi,
            tipo: 'AR2'
        });

        const total_documentos = '';
        const nuevoModulo='SIN DESCARGO IFI';

        
        await updateDocumento({id_nc, total_documentos, nuevoModulo});

         
         
        if (response) {

            const findNC = await getIFIforAR2Controller(response.id);
            const plainNC = findNC.toJSON();

            io.emit("sendAR2", { data: [plainNC] });

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
        console.error('Error al crear el IFI:', error);
        return res.status(500).json({ message: 'Error interno del servidor al crear el Descargo IFI' });
    }
}

module.exports = { getAllIFIforAnalista2Handler, createDescargoIFIHandler, sendWithoutDescargoIFIHandler };
