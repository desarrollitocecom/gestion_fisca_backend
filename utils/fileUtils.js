const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { PDF_RUTA } = process.env;


function saveImage(file, folder) {
    const uploadDir = path.join(PDF_RUTA, 'uploads', folder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFileName = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const newPath = path.join(uploadDir,`${uniqueFileName}${fileExtension}`);
    console.log("Este es el new path:", newPath);

    try {
        // Copiar archivo al nuevo destino
        fs.copyFileSync(file.path, newPath);

        // Eliminar el archivo original después de copiarlo
        fs.unlinkSync(file.path);
    } catch (error) {
        console.error("Error al mover el archivo:", error);
        throw error; // Lanza el error para que sea manejado adecuadamente
    }

    const relativePath = path.join('uploads', folder, `${uniqueFileName}${fileExtension}`).replace(/\\/g, '/');

    return relativePath.replace(/^.\//, '');
}

const deleteFile = (filePath) => {
    if (filePath) {
        // Si la ruta es relativa, la combinamos con PDF_RUTA
        const fullPath = path.resolve(PDF_RUTA, filePath);
        
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
                console.log(`Archivo ${fullPath} eliminado`);
            } catch (error) {
                console.error(`Error eliminando archivo ${fullPath}:`, error);
            }
        } else {
            console.log(`Archivo no encontrado: ${fullPath}`);
        }
    }
};
module.exports = { saveImage, deleteFile };
