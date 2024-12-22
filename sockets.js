const socketIo = require("socket.io");
const {
  getNCforInstructiva,
} = require("../gestion_fisca_backend/controllers/ncController");
const cache = require("./middlewares/cacheNodeStocked");
// Mapa para almacenar los sockets de los usuarios
const userSockets = new Map();

let io; // Declaramos io como variable global en este módulo

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "", // Cambia "" por tu dominio permitido, por ejemplo, "http://localhost:3000"
      methods: ["GET", "POST"],
    },
  });
  let prueba;
  io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    // Evento de registro: asociamos el socket con el usuario
    socket.on("register", (userName) => {
      userSockets.set(userName, socket); // Asocia el ID de usuario con el socket
    });
    socket.on("modal", async ({ id, type, area, doc }) => {
      try {
        // console.log(type, area);
        const key = `${area}-${id}`;
        // cache.set(key, { disabled:type });
        if (area == "Ainstructiva") {
          const findNC = await getNCforInstructiva(id);
          const plainNC = findNC.toJSON();

          // Leer el estado actual desde el cache (si existe)
          const cachedData = cache.get(key);
          plainNC.disabled = cachedData ? cachedData.disabled : false; // Valor predeterminado: false

          if (type === "open") {
            prueba = "está abierto";
            plainNC.disabled = true;

            // Guardar en cache con disabled: true
            cache.set(key, { disabled: true });
            
          } else if (type === "close") {
            prueba = "está cerrado";
            plainNC.disabled = false;
            cache.set(key, { disabled: false });
          
          } else if (type === "refresh") {

            // Eliminar del cache
            const deleted = cache.del(key);
            if (deleted) {
              console.log(`Modal ${key} eliminado del cache`);
            } else {
              console.log(`Modal ${key} no encontrado en cache para eliminar`);
            }

            // Resetear plainNC.disabled si se elimina del cache
            plainNC.disabled = false;
          }

          io.emit("sendAI1", { data: [plainNC] });

          console.log("Datos emitidos con éxito:", plainNC);
        }
      } catch (error) {
        console.error("Error en el evento 'modal':", error);
      }
    });
    // Desconexión: eliminamos el socket del mapa
    socket.on("disconnect", () => {
      // userSockets.forEach((value, key) => {
      //     if (value.id === socket.id) {
      //         // userSockets.delete(key); // Elimina el socket asociado al userName
      //     }
      // });
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
}

// Exportamos la función para obtener la instancia global de io
function getIo() {
  if (!io) {
    throw new Error(
      "Socket.io no está inicializado. Llama a initializeSocket primero."
    );
  }
  return io;
}

module.exports = { initializeSocket, userSockets, getIo };