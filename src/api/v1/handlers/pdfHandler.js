const { PDF_RUTA } = process.env;
const path = require('path');

const getPdfHandler = async (req, res) => {
    try {
        const { ruta, nombre } = req.query;

        const filePath = path.join(`${PDF_RUTA}`, ruta);
        console.log("Ruta del archivo:", filePath);

        const friendlyName = nombre;

        res.setHeader('Content-Disposition', `inline; filename="${friendlyName}"`);
        res.setHeader('Content-Type', 'application/pdf');

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error al servir el archivo:', err);
                res.status(500).send('Error al mostrar el archivo');
            }
        });

    } catch (error) {
        console.error("Error del servidor al traer la lista para el Analista 1:", error);
        res.status(500).json({ error: "Error del servidor al traer la lista para el Analista 1" });
    }
};



module.exports = { getPdfHandler };
