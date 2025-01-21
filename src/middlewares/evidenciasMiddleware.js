const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ruta donde se almacenarán las imágenes
const { DOC_RUTA } = process.env;

// Crear la carpeta DOC_RUTA si no existe
if (!fs.existsSync(DOC_RUTA)) {
    fs.mkdirSync(DOC_RUTA, { recursive: true });
}

// Expresión regular para validar nombres de archivos: foto_000XXX-YYYY
const fotoRegex = /^foto_\d{6}-\d{4}$/;

// Configuración del almacenamiento con validación y UUID
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DOC_RUTA);
    },
    filename: (req, file, cb) => {
        const fieldName = file.fieldname;
        const fileExt = path.extname(file.originalname).toLowerCase();

        // Validar nombre del campo en FormData
        if (!fotoRegex.test(fieldName)) {
            return cb(new Error(`❌ Formato inválido: ${fieldName}. Debe seguir el formato foto_000XXX-YYYY`));
        }

        // Generar UUID para el archivo
        const newFileName = `${uuidv4()}${fileExt}`;
        cb(null, newFileName);
    }
});

// Middleware Multer configurado
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50MB por archivo
    fileFilter: (req, file, cb) => {
        // Solo imágenes permitidas
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExt = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            return cb(new Error(`❌ Tipo de archivo no permitido: ${fileExt}. Solo se aceptan imágenes JPEG, JPG o PNG.`));
        }
        cb(null, true);
    }
});

// Middleware para subir fotos con nombres personalizados (UUID)
const uploadFotosActas = (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

// ✅ Función para eliminar un archivo
const deleteFile = (fileName) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(DOC_RUTA, fileName);

        // Validar si el archivo existe antes de eliminarlo
        if (!fs.existsSync(filePath)) {
            return resolve(`⚠️ Archivo no encontrado: ${fileName}`);
        }

        // Eliminar el archivo
        fs.unlink(filePath, (err) => {
            if (err) return reject(new Error(`❌ Error al eliminar el archivo: ${err.message}`));
            resolve(`✅ Archivo eliminado correctamente: ${fileName}`);
        });
    });
};

module.exports = {
    uploadFotosActas,
    deleteFile
};
