const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { PDF_RUTA } = process.env;
const PDFDocument = require('pdfkit'); // Importa la biblioteca para manejar PDFs

function saveImage(file, folder) {
    const uploadDir = path.join(PDF_RUTA, 'uploads', folder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFileName = uuidv4();
    const fileExtension = path.extname(file.originalname).toLowerCase();

    const isImage = ['.jpg', '.jpeg', '.png', '.bmp', '.gif'].includes(fileExtension);

    const newFileName = `${uniqueFileName}.pdf`; // Siempre generamos un PDF
    const newPath = path.join(uploadDir, newFileName);

    try {
        if (isImage) {
            const doc = new PDFDocument({
                size: 'A4', // Tamaño del documento (ajústalo según lo que necesites)
                margin: 0    // Elimina los márgenes
            });
            const writeStream = fs.createWriteStream(newPath);

            doc.pipe(writeStream);

            // Agregar la imagen para que ocupe toda la página
            doc.image(file.path, {
                fit: [doc.page.width, doc.page.height], // Ajusta la imagen al tamaño de la página
                align: 'center',
                valign: 'center'
            });

            doc.end();

            writeStream.on('finish', () => {
                fs.unlinkSync(file.path); // Elimina el archivo temporal original
            });
        } else {
            fs.copyFileSync(file.path, newPath);
            fs.unlinkSync(file.path);
        }
    } catch (error) {
        console.error("Error al procesar el archivo:", error);
        throw error;
    }

    const relativePath = path.join('uploads', folder, newFileName).replace(/\\/g, '/');
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
