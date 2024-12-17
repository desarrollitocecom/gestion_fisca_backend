
require("dotenv").config();

const express = require("express");

const http = require("http");

const { sequelize } = require("./db_connection");

const router = require("./routes/index");

const { PORT_FISCA, PDF_RUTA } = process.env;


const tramiteInspector = require("../gestion_fisca_backend/routes/tramiteInspectorRouter");

const { initializeSocket } = require("./sockets"); // Importa solo initializeSocket

const loginMiddleware = require("./checkers/validateToken");

const usuariosRouter = require("./routes/loginRouter");

const facialLoginRouter = require("../gestion_fisca_backend/routes/facialLoginRouter");

const cors = require("cors");

const path = require("path");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use("/login", usuariosRouter);

app.use("/inspector", tramiteInspector);

app.use(loginMiddleware); // Middleware global para validar rutas

const server = http.createServer(app); // Servidor HTTP

initializeSocket(server); // Inicializa Socket.IO (eventos ya definidos en sockets.js)

app.use("/", router);

app.use("/logininspector", facialLoginRouter);


app.get("/", (req, res) => {
  res.json({ message: "El servidor está funcionando!", data: "Bien perro!" });
});

app.use(
  "/uploads",
  express.static(path.join(PDF_RUTA, "uploads"))
); // Permite acceso a archivos en '/uploads'

server.listen(PORT_FISCA, () => {
  console.log(`FISCA Server is running on port ${PORT_FISCA}`);
  sequelize
    .sync({ alter: true })
    .then(() => console.log("Database is connected"))
    .catch((err) => console.error("Error connecting to the database:", err));
});
