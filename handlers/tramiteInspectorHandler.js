const { createTramiteInspector } = require('../controllers/tramiteInspectorController');

const createTramiteHandler = async (req, res) => {
    const { nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional } = req.body;
    const errors = [];

    if (!nro_nc) {
        errors.push('Ingrese nro_nc obligatorio');
    }

    if (!documento_nc) {
        errors.push('El documento NC es obligatorio');
    } else {
        const base64Data = documento_nc.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const pdfSignature = buffer.slice(0, 4).toString();
    
        if (pdfSignature !== '%PDF') {
            errors.push('El archivo proporcionado debe ser un PDF');
        }    
    }

    if (!nro_acta) {
        errors.push('Ingrese nro_acta obligatorio');
    }

    if (!documento_acta) {
        errors.push('El documento NC es obligatorio');
    } else {
        const base64Data = documento_acta.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const pdfSignature = buffer.slice(0, 4).toString();
    
        if (pdfSignature !== '%PDF') {
            errors.push('El archivo proporcionado debe ser un PDF');
        }    
    }


    if (acta_opcional) {
        
        const base64Data = acta_opcional.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const pdfSignature = buffer.slice(0, 4).toString();
    
        if (pdfSignature !== '%PDF') {
            errors.push('El archivo proporcionado debe ser un PDF');
        }    
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(", ") });
    }

    try {
        const newTramiteInspector = await createTramiteInspector({ nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional });
        if (newTramiteInspector) {
            res.status(201).json({
                message: 'Trámite creado con éxito',
                data: newTramiteInspector,
            });
        } else {
            res.status(400).json({
                message: 'Error al crear el trámite',
            });
        }
    } catch (error) {
        console.error('Error al crear el trámite:', error);
        return res.status(500).json({ message: 'Error interno del servidor al crear el trámite' });
    }
};

module.exports = { createTramiteHandler };
