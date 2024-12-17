const { updateNC, getAllNCforInstructiva } = require('../controllers/ncController');
const { createInformeFinalController, getIFIforAR1Controller, getIFIforAnalista2Controller } = require('../controllers/informeFinalController');
const { updateDocumento }=require('../controllers/documentoController');
const { getIo } = require('../sockets'); 


function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

const getAllNCforInstructivaHandler = async (req, res) => {  

    try {
        const response = await getAllNCforInstructiva();

        if (response.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más tramites',
                data: []
            });
        }

        return res.status(200).json({
            message: "Tramites obtenidos correctamente",
            data: response,
        });
    } catch (error) {
        console.error("Error al obtener tipos de documentos de identidad:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los tramites." });
    }
};

const createInformeFinalHandler = async (req, res) => {
    const io = getIo(); 

    const { nro_ifi, fecha, id_nc, id_AI1, tipo } = req.body;
    const documento_ifi = req.files && req.files["documento_ifi"] ? req.files["documento_ifi"][0] : null;

    const errores = []

    if (!nro_ifi) errores.push('El campo es requerido')
    if (typeof nro_ifi != 'string') errores.push('El nro debe ser una cadena de texto')
    if (!fecha) errores.push("El campo es requerido")
    if (!Date.parse(fecha)) errores.push("Debe ser una fecha y seguir el formato YYYY-MM-DD")
    if (!documento_ifi || documento_ifi.length === 0) {
        errores.push("El documento_ifi es requerido.");
    } else {
        if (documento_ifi.length > 1) {
            errores.push("Solo se permite un documento_ifi.");
        } else if (documento_ifi.mimetype !== "application/pdf") {
            errores.push("El documento debe ser un archivo PDF.");
        }
    }
   if (!id_AI1) errores.push('El campo id_AI1 es requerido');

    if (!isValidUUID(id_AI1)) errores.push('El id_AI1 debe ser una UUID');
    if (!id_nc) errores.push('El campo id_nc es requerido');

    if (!isValidUUID(id_nc)) errores.push('El id_nc debe ser una UUID');

    if (errores.length > 0) {
        if (documento_ifi) {
            fs.unlinkSync(documento_ifi.path);
        }
        return res.status(400).json({
            message: "Se encontraron los Siguientes Errores",
            data: errores
        })
    }
 

    try {

        const newIFI = await createInformeFinalController({ nro_ifi, fecha, documento_ifi, id_nc, id_AI1, tipo });
       

        const total_documentos=newIFI.documento_ifi

        const nuevoModulo="INFORME FINAL INSTRUCTIVO"

        await updateDocumento({id_nc, total_documentos, nuevoModulo});

        const ifiId = newIFI.id;  

        const response = await updateNC( id_nc, { id_nro_IFI: ifiId, estado: 'TERMINADO' });
        
        // return res.status(200).json({ message: 'Nuevo Informe Final Creado', data: response })

        if (response) {

            let findNC;

            if(tipo=='RSG1'){
                findNC = await getIFIforAR1Controller(response.id);
                const plainNC = findNC.toJSON();
                io.emit("sendAR1", { data: [plainNC] });
            }

            if(tipo=='ANALISTA_2'){
                findNC = await getIFIforAnalista2Controller(response.id);
                const plainNC = findNC.toJSON();
                io.emit("sendAnalista2", { data: [plainNC] });
            }

            

            res.status(201).json({
                message: 'Nuevo Informe Final Creado',
                data: [findNC]
            });
        } else {
           res.status(400).json({
                message: 'Error al crear Descargo NC',
            });
        }

    } catch (error) {
        console.error('Error al crear el Informe final:', error);
        return res.status(500).json({
            message: 'Error al crear el informe Final',
            error: error.message
        });
    }
};

module.exports = { getAllNCforInstructivaHandler, createInformeFinalHandler };
