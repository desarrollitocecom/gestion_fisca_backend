const { createTramiteInspector, getAllTramiteInspector } = require('../controllers/tramiteInspectorController');
const { Usuario } = require('../db_connection');
const argon2 = require('argon2');

const validatePDF = (base64String, fieldName, errors) => {
    if (base64String) {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const pdfSignature = buffer.slice(0, 4).toString();

        if (pdfSignature !== '%PDF') {
            errors.push(`El archivo proporcionado en ${fieldName} debe ser un PDF`);
        }
    } else {
        errors.push(`El campo ${fieldName} es obligatorio`);
    }
};

const createTramiteHandler = async (req, res) => {
    const { nro_nc, documento_nc, nro_acta, documento_acta, nro_opcional, acta_opcional, id_inspector } = req.body;
    const errors = [];

    if (!nro_nc) {
        errors.push('Ingrese nro_nc obligatorio');
    }

    validatePDF(documento_nc, 'documento_nc', errors);

    if (!nro_acta) {
        errors.push('Ingrese nro_acta obligatorio');
    }

    validatePDF(documento_acta, 'documento_acta', errors);

    if (acta_opcional) {
        validatePDF(acta_opcional, 'acta_opcional', errors);
    }

    if (!id_inspector) {
        errors.push('El inspector es obligatorio');
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

const usuarioPruebaHandler = async (req, res) => {
    try {
        const newTramiteNC = await Usuario.create({
            usuario: 'prueba',
            contraseña: await argon2.hash('123123123'),
            correo: 'prueba@hotmail.com',
            token: null,
            state: true,
        });

        if (newTramiteNC) {
            return res.status(201).json(newTramiteNC);
        } else {
            return res.status(500).json({ message: 'Error creating user' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

const allTramiteHandler = async (req, res) => {
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
        const response = await getAllTramiteInspector(Number(page), Number(limit));

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

module.exports = { createTramiteHandler, usuarioPruebaHandler, allTramiteHandler };
