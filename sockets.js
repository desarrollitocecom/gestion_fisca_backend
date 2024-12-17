const socketIo = require("socket.io");

// Mapa para almacenar los sockets de los usuarios
const userSockets = new Map();

let io; // Declaramos io como variable global en este módulo

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*", // Cambia "*" por tu dominio permitido, por ejemplo, "http://localhost:3000"
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);

        // Evento de registro: asociamos el socket con el usuario
        socket.on("register", (userName) => {
            console.log("registro:", userName);
            userSockets.set(userName, socket); // Asocia el ID de usuario con el socket
        });

        // Desconexión: eliminamos el socket del mapa
        socket.on("disconnect", () => {
            userSockets.forEach((value, key) => {
                if (value.id === socket.id) {
                    userSockets.delete(key); // Elimina el socket asociado al userName
                }
            });
            console.log(`Cliente desconectado: ${socket.id}`);
        });
        let id;
        socket.on("modal", (a) => {
            id = a;
            console.log(id);
            socket.emit("todos", id);
            
        });
    });
}

// Exportamos la función para obtener la instancia global de io
function getIo() {
    if (!io) {
        throw new Error("Socket.io no está inicializado. Llama a initializeSocket primero.");
    }
    return io;
}

module.exports = { initializeSocket, userSockets, getIo };
