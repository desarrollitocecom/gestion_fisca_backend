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
    const newPath = path.join(uploadDir, `${uniqueFileName}${fileExtension}`);
      console.log("este es el new path",newPath);
      
    fs.renameSync(file.path, newPath);

    const relativePath = path.join('uploads', folder, `${uniqueFileName}${fileExtension}`).replace(/\\/g, '/');
    
    
    return relativePath.replace(/^.\//, '');
    
}


const deleteFile = (filePath) => {
    if (filePath) {
        try {
            fs.unlinkSync(path.resolve(filePath));
            console.log(`Archivo ${filePath} eliminado`);
        } catch (error) {
            console.error(`Error eliminando archivo ${filePath}:`, error);
        }
    }
};

module.exports = { saveImage, deleteFile };
