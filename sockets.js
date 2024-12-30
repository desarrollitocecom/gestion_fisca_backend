const socketIo = require("socket.io");
const { getNCforInstructiva, getNCforAnalista, getNCforDigitador } = require("../gestion_fisca_backend/controllers/ncController");
const { getIFIforAnalista2Controller, getIFIforAR1Controller, getIFIforAR2Controller } = require("../gestion_fisca_backend/controllers/informeFinalController");
const { getRSAforAnalista3Controller, getRSAforAR3Controller, getRSAforAnalista5Controller } = require("../gestion_fisca_backend/controllers/rsaController")
const { getRSGforAnalista4Controller, getRSGforGerenciaController, getRSGforAnalista5Controller } = require("../gestion_fisca_backend/controllers/rsgController")
const { getRGforAnalista5Controller } = require("../gestion_fisca_backend/controllers/rgController")

const cache = require("./middlewares/cacheNodeStocked");
// Mapa para almacenar los sockets de los usuarios
const userSockets = new Map();


const areaMap = {
  "Digitador": {
    getFunction: getNCforDigitador,  
    emitEvent: "sendDigitador"  
  },
  "AnalistaOne": {
    getFunction: getNCforAnalista,  
    emitEvent: "sendAnalista1"  
  },
  "AInstructiva": {
    getFunction: getNCforInstructiva,  
    emitEvent: "sendAI1"  
  },
  "AResolutivaOne": {
    getFunction: getIFIforAR1Controller,  
    emitEvent: "sendAR1"  
  },
  "AnalistaTwo": {
    getFunction: getIFIforAnalista2Controller,  
    emitEvent: "sendAnalista2"  
  },
  "AResolutivaTwo": {
    getFunction: getIFIforAR2Controller,  
    emitEvent: "sendAR2"  
  },
  "AnalistaThree": {
    getFunction: getRSAforAnalista3Controller,  
    emitEvent: "sendAnalista3"  
  },
  "AResolutivaThree": {
    getFunction: getRSAforAR3Controller,  
    emitEvent: "sendAR3"  
  },
  "AnalistaFour": {
    getFunction: getRSGforAnalista4Controller,  
    emitEvent: "sendAnalista4"  
  },
  "Gerencia": {
    getFunction: getRSGforGerenciaController,  
    emitEvent: "sendGerencia"  
  },
  "AnalistaFive-AR3": {
    getFunction: getRSAforAnalista5Controller,  
    emitEvent: "sendAnalita5fromAnalista3"  
  },
  "AnalistaFive-AR4": {
    getFunction: getRSGforAnalista5Controller,  
    emitEvent: "sendAnalita5fromAnalista4"  
  },
  "AnalistaFive-Gerencia": {
    getFunction: getRGforAnalista5Controller,  
    emitEvent: "sendAnalita5fromGerencia"  
  },
};


let io; // Declaramos io como variable global en este módulo

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*", // Cambia "" por tu dominio permitido, por ejemplo, "http://localhost:3000"
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    // Evento de registro: asociamos el socket con el usuario
    socket.on("register", (userName) => {
      userSockets.set(userName, socket); // Asocia el ID de usuario con el socket
    });

    socket.on("modal", async ({ id, type, area }) => {
      try { 
        // Verifica si el área está en el mapeo
        const areaConfig = areaMap[area];
        //console.log(areaConfig);

        if (areaConfig) {
          const { getFunction, emitEvent } = areaConfig;  // Obtén la función y el evento correspondiente
    
          const key = `${area}-${id}`;
    
          // Llamar a la función correspondiente para obtener los datos
          const findNC = await getFunction(id);
          const plainNC = findNC.toJSON();
    
          const cachedData = cache.get(key);
          plainNC.disabled = cachedData ? cachedData.disabled : false;
    
          if (type === "open") {
            plainNC.disabled = true;
            cache.set(key, { disabled: true });
            //console.log(plainNC);
            
          } else if (type === "close") {
            plainNC.disabled = false;
            cache.del(key);
          } else if (type === "refresh") {
            cache.del(key);
            plainNC.disabled = false;
          }
    
          // Emitir el evento dinámicamente
          io.emit(emitEvent, { data: [plainNC] });
        } else {
          console.error(`Área desconocida: ${area}`);
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