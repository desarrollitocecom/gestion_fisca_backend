require("dotenv").config();
const express = require("express");
const http = require("http");
const { sequelize } = require("./src/config/db_connection");
const router = require("./src/api/v1/routes/index");
const { PORT, PDF_RUTA, DOC_RUTA } = process.env;

const tramiteInspector = require('./src/api/v1/routes/tramiteInspectorRouter');

//con fe
const { initializeSocket, userSockets } = require("./src/sockets");
const loginMiddleware = require("./src/checkers/validateToken");
const usuariosRouter = require("./src/api/v1/routes/loginRouter");
const cors = require("cors");
const path = require('path'); //traer path
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const multer = require('multer');
app.use("/login", usuariosRouter);
app.use('/inspector', tramiteInspector);
















app.get('/verPDF123', (req, res) => {
  console.log('sdasadsda')
  const { ruta, nombre } = req.query;

  // Verifica que la ruta esté correcta
  const filePath = path.join('C:/Users/James/gestion_fisca/', ruta);
  console.log("Ruta del archivo:", filePath); // Esto te ayudará a verificar la ruta

  // Nombre amigable que quieres mostrar
  const friendlyName = nombre; // Cambia esto según el archivo

  // Configurar encabezados para que el navegador use un nombre amigable
  res.setHeader('Content-Disposition', `inline; filename="${friendlyName}"`);
  res.setHeader('Content-Type', 'application/pdf'); // Cambia el tipo MIME según tu archivo

  // Enviar el archivo
  res.sendFile(filePath, (err) => {
      if (err) {
          console.error('Error al servir el archivo:', err);
          res.status(500).send('Error al mostrar el archivo');
      }
  });
});





















// no aplica authMiddleware para el manejo de usuarios
app.use(loginMiddleware); // usa el middleware globalmente para validar todas las rutas a las que se va a acceder en el sistema solo estando logeado
const server = http.createServer(app); // servidor http a partir de express
const facialLoginRouter = require('./src/api/v1/routes/facialLoginRouter');

initializeSocket(server); // Inicializamos Socket.io

app.use("/", router);
app.use('/logininspector', facialLoginRouter);
app.get("/", (req, res) => {
  res.json({ message: "El servidor esta funcionando!", data: "Bien perro!" });
});

app.use('/uploads', express.static(path.join(PDF_RUTA, 'uploads'))); //para leerlo defrente y el front tenga acceso a esos archivos
app.use('/uploads/evidencias', express.static(path.resolve(DOC_RUTA)));

server.listen(PORT, () => {
  console.log(`FISCA Server is running on port ${PORT}`);
  sequelize.sync({  alter: true }) // cambiar de alter a force para que se borren las tablas y se creen de nuevo, hasta que queden bien diseñadas
    .then(() => console.log("Database is connected")) //con fe
    .catch(err => console.error("Error connecting to the database:", err));
});

module.exports = { userSockets };

// expressurl encode