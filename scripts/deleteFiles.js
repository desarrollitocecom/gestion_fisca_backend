const fs = require('fs');
const path = require('path');

// Ajusta la ruta base para que apunte a la carpeta 'uploads'
const baseDir = path.join(__dirname, '..', 'uploads'); // Sube un nivel y accede a 'uploads'

// Nombres de las subcarpetas
const folders = ['AF', 'NC', 'Opcional'];

// Función para borrar todos los archivos de una carpeta
const deleteFilesInFolder = (folderPath) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error al leer la carpeta ${folderPath}:`, err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error al borrar el archivo ${filePath}:`, err);
                } else {
                    console.log(`Archivo ${filePath} borrado exitosamente.`);
                }
            });
        });
    });
};

// Iterar sobre las carpetas y borrar los archivos
folders.forEach((folder) => {
    const folderPath = path.join(baseDir, folder);
    deleteFilesInFolder(folderPath);
});
