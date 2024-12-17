const { createTramiteInspector, getAllTramiteInspectorById } = require('../controllers/tramiteInspectorController');
const { createMedidaComplementaria } = require('../controllers/medidaComplementariaController')
const { createNC, getNCforDigitador } = require('../controllers/ncController');
const fs = require('fs');
const { createDocumento, updateDocumento } = require('../controllers/documentoController');
const { getIo } = require('../sockets'); 

const createTramiteHandler = async (req, res) => {
    const io = getIo(); 
    

    const { 

            id_documento, 
            nro_medida_complementaria,

            nro_nc, 
            nro_acta, 
            id_inspector, 

        } = req.body;

        const errors = [];

        if (!nro_nc) {
            errors.push('Ingrese nro_nc obligatorio');
        }
    
        if (!nro_acta) {
            errors.push('Ingrese nro_acta obligatorio');
        }

        if(!req.files['documento_nc']){
            errors.push('El documento_nc es obligatorio');
        }else{
           
            if (!['image/jpeg', 'image/png'].includes(req.files['documento_nc'][0].mimetype)) {
                errors.push('El documento_nc debe ser una imagen en formato JPEG, PNG o GIF');
            }
        }

        if(!req.files['documento_acta']){
            errors.push('El documento_acta es obligatorio');
        }else{
            if (!['image/jpeg', 'image/png'].includes(req.files['documento_acta'][0].mimetype)) {
                errors.push('El documento_acta debe ser una imagen en formato JPEG, PNG o GIF');
            }
        }

        if (!id_inspector) {
            errors.push('El inspector es obligatorio');
        }


        const relatedFields = [id_documento, nro_medida_complementaria, req.files['documento_medida_complementaria']];
        const anyRelatedFieldFilled = relatedFields.some(field => field !== undefined && field !== null);

        if (anyRelatedFieldFilled) {
            if (!id_documento) {
                errors.push('El campo id_documento es obligatorio cuando se proporciona alguno de los otros campos relacionados.');
            }
            if (!nro_medida_complementaria) {
                errors.push('El campo nro_medida_complementaria es obligatorio cuando se proporciona alguno de los otros campos relacionados.');
            }
            if(!req.files['documento_medida_complementaria']){
                errors.push('El documento Medida Complementaria es obligatorio');
            }else{
                if (!['image/jpeg', 'image/png'].includes(req.files['documento_acta'][0].mimetype)) {
                    errors.push('El documento_acta debe ser una imagen en formato JPEG, PNG o GIF');
                }
            }
        }


        if (errors.length > 0) {
            if (req.files['documento_nc']) {
                fs.unlinkSync(req.files['documento_nc'][0].path); 
            }
            if (req.files['documento_acta']) {
                fs.unlinkSync(req.files['documento_acta'][0].path); 
            }
            if (req.files['documento_medida_complementaria']) {
                fs.unlinkSync(req.files['documento_medida_complementaria'][0].path); 
            }
            return res.status(400).json({ error: errors.join(", ") });
        }





        try {
            let id_medida_complementaria = null;
            let newMedidaComplementaria = null;
    
            const shouldCreateMedidaComplementaria = id_documento && nro_medida_complementaria && req.files['documento_medida_complementaria'];
    
            if (shouldCreateMedidaComplementaria) {
                newMedidaComplementaria = await createMedidaComplementaria({
                    id_documento,
                    nro_medida_complementaria,
                    documento_medida_complementaria: req.files['documento_medida_complementaria'][0],
                });

                if (newMedidaComplementaria) {
                    id_medida_complementaria = newMedidaComplementaria.id;
                } else {
                    return res.status(400).json({ error: 'Error al crear la Medida Complementaria' });
                }
            }
    
            //aqui creo el tramite inspector
            const newTramiteInspector = await createTramiteInspector({ 
                nro_nc, 
                documento_nc: req.files['documento_nc'][0], 
                nro_acta, 
                documento_acta: req.files['documento_acta'][0], 
                id_medida_complementaria, 
                estado: 'DIGITADOR',
                id_inspector
            });
            
             if (!newTramiteInspector) {
               return res.status(400).json({ error: 'Error al crear el Trámite Inspector' });
             }

            const id_tramiteInspector = newTramiteInspector.id;

            //aqui creo el NC
            const newNC = await createNC({ id_tramiteInspector: newTramiteInspector.id });
            
            const modelNC = 'NOTIFICACIÓN DE CARGO';
            
            const nuevo_doc=newTramiteInspector.documento_nc

            const id_nc = newNC.id;


            const total_documentos = newTramiteInspector.documento_acta;
            
            let nuevoModulo = 'ACTA DE FISCALIZACIÓN';
           

                await createDocumento(modelNC, id_nc, nuevo_doc);

                await updateDocumento({id_nc, total_documentos, nuevoModulo});

                if(newMedidaComplementaria){
                    const total_documentos = newMedidaComplementaria.documento_medida_complementaria;
                    if(id_documento == 1) nuevoModulo = 'ACTA DE EJECUCION DE MP';
                    if(id_documento == 2) nuevoModulo = 'VALORIZACION DE LA OBRA';
                    if(id_documento == 3) nuevoModulo = 'ACTA DE RETENCION Y/O DECOMISO';
                    if(id_documento == 4) nuevoModulo = 'ACTA DE EVALUACION SANITARIA';
                    if(id_documento == 5) nuevoModulo = 'INFORME TECNICO';
                    if(id_documento == 6) nuevoModulo = 'ACTA DE RETIRO';

                    await updateDocumento({id_nc, total_documentos, nuevoModulo});
                }

                
            if (newNC) {
                const findNC = await getNCforDigitador(newNC.id)
               
                const plainNC = findNC.toJSON();

                io.emit("sendDigitador", { data: [plainNC] });

                res.status(201).json({
                    data: [findNC]
                });
           } else {
               res.status(400).json({
                   message: 'Error al crear el NC',
               });
           }
            } catch (error) {
                console.error('Error al crear el NC:', error);
                return res.status(500).json({ message: 'Error interno del servidor al crear el trámite' });
            }
}


const allTramiteHandler = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    
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
        const response = await getAllTramiteInspectorById(id, Number(page), Number(limit));

        if (response.data.length === 0) {
            return res.status(200).json({
                message: 'Ya no hay más tramites',
                data: {
                    data: [],
                    totalPage: response.currentPage,
                    totalCount: response.totalCount
                }
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

module.exports = { createTramiteHandler, allTramiteHandler };
