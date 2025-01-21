const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ruta donde se almacenarán las imágenes
const { DOC_RUTA } = process.env;

// Configuración del almacenamiento con validación y UUID :
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, DOC_RUTA),
    filename: (req, file, cb) => {
        const fieldName = file.fieldname;
        const fileExt = path.extname(file.originalname).toLowerCase();

        // Validar nombre del campo en FormData
        if (!/^foto_\d{6}-\d{4}$/.test(fieldName)) return cb(new Error(`Formato inválido: ${fieldName}. Debe seguir el formato foto_000XXX-YYYY`));

        // Generar UUID para el archivo
        const newFileName = `${uuidv4()}${fileExt}`;
        cb(null, newFileName);
    }
});

// Middleware Multer configurado :
const upload = multer({
    storage: storage,
    limits: { fileSize: 150 * 1024 * 1024 }, // Límite de 150MB por archivo
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExt = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExt)) return cb(new Error(`Tipo de archivo no permitido: ${fileExt}. Solo se aceptan imágenes JPEG, JPG o PNG.`));
        cb(null, true);
    }
});

// Middleware para subir fotos con nombres personalizados (UUID) :
const uploadFotosActas = (req, res, next) => {
    upload.any()(req, res, (err) => {
        
        if (err) return res.status(400).json({ error: err.message });
        
        // Procesar los campos JSON dentro de FormData
        const actasData = {};
        Object.keys(req.body).forEach(key => {
            if (key.startsWith('acta_')) {
                try {
                    actasData[key] = JSON.parse(req.body[key]);
                } catch (error) {
                    return res.status(400).json({ error: `Error en el JSON de ${key}: ${error.message}` });
                }
            }
        });
        
        req.body.actas = actasData;
        next();
    });
};

// Función para eliminar un archivo :
const deleteFile = (fileName) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(DOC_RUTA, fileName);

        // Validar si el archivo existe antes de eliminarlo :
        if (!fs.existsSync(filePath)) return resolve(`Archivo no encontrado: ${fileName}`);

        // Eliminar el archivo :
        fs.unlink(filePath, (err) => {
            if (err) return reject(new Error(`Error al eliminar el archivo: ${err.message}`));
            resolve(`Archivo eliminado correctamente: ${fileName}`);
        });
    });
};

module.exports = {
    uploadFotosActas,
    deleteFile
};
