const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const argon2 = require("argon2");

// Conexión a la base de datos
const sequelize = new Sequelize("gestion_fiscalizacion", "postgres", "123", {
  host: "localhost",
  dialect: "postgres",
});

// Importar modelos
const TipoDocumentoComplementario = require("../models/TipoDocumentoComplementario")(sequelize);
const Infraccion = require("../models/Infraccion")(sequelize);
const EstadoMC = require("../models/EstadoMC")(sequelize);
const EstadoNC = require("../models/EstadoNC")(sequelize);
const EjecucionMC = require("../models/EjecucionMC")(sequelize);
const Usuario = require("../models/Usuario")(sequelize);
const TipoDocumentoIdentidad = require("../models/TipoDocumentoIdentidad")(sequelize);
const EstadoDescargoNC = require("../models/EstadoDescargoNC")(sequelize);

const insertData = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");

    // Sincronizar modelos
    await sequelize.sync({ force: true }); // CUIDADO: Elimina y vuelve a crear tablas

    // Insertar datos ficticios en TipoDocumentoComplementario
    await TipoDocumentoComplementario.bulkCreate([
      { documento: "Licencia de Funcionamiento" },
      { documento: "Certificado de Defensa Civil" },
      { documento: "Permiso Municipal" },
    ]);

    // Insertar datos ficticios en Infraccion
    await Infraccion.bulkCreate([
      {
        actividad_economica: "Comercio",
        codigo: "C01",
        descripcion: "Venta sin autorización",
        tipo: "Grave",
        monto: 500,
        lugar_infraccion: "Mercado Central",
      },
      {
        actividad_economica: "Transporte",
        codigo: "T02",
        descripcion: "Falta de seguro vehicular",
        tipo: "Moderada",
        monto: 300,
        lugar_infraccion: "Avenida Principal",
      },
      {
        actividad_economica: "Construcción",
        codigo: "B03",
        descripcion: "Construcción sin licencia",
        tipo: "Grave",
        monto: 1000,
        lugar_infraccion: "Zona Industrial",
      },
    ]);

    // Insertar datos ficticios en EstadoMC
    await EstadoMC.bulkCreate([
      { nombre: "Pendiente" },
      { nombre: "En Proceso" },
      { nombre: "Finalizado" },
    ]);

    // Insertar datos ficticios en EstadoNC
    await EstadoNC.bulkCreate([
      { tipo: "Observado" },
      { tipo: "Validado" },
      { tipo: "Rechazado" },
    ]);

    // Insertar datos ficticios en EjecucionMC
    await EjecucionMC.bulkCreate([
      { nombre: "Ejecución Inicial" },
      { nombre: "Ejecución Intermedia" },
      { nombre: "Ejecución Final" },
    ]);

    // Insertar datos ficticios en EstadoDescargoNC
    await EstadoDescargoNC.bulkCreate([
      { tipo: "Ejecución 1" },
      { tipo: "Ejecución 2" },
      { tipo: "Ejecución 3" },
    ]);

    // Insertar datos ficticios en Usuario
    const hashedPassword = await argon2.hash("password123");
    await Usuario.bulkCreate([
      {
        usuario: "admin",
        contraseña: hashedPassword,
        correo: "admin@example.com",
        id_rol: 1, // Asegúrate de tener un rol con ID 1
      },
      {
        usuario: "user1",
        contraseña: hashedPassword,
        correo: "user1@example.com",
        id_rol: 1, // Asegúrate de tener un rol con ID 1
      },
      {
        usuario: "user2",
        contraseña: hashedPassword,
        correo: "user2@example.com",
        id_rol: 1, // Asegúrate de tener un rol con ID 1
      },
    ]);

    // Insertar datos ficticios en TipoDocumentoIdentidad
    await TipoDocumentoIdentidad.bulkCreate([
      { documento: "DNI" },
      { documento: "Pasaporte" },
      { documento: "Carnet de Extranjería" },
    ]);

    console.log("Datos insertados correctamente.");
  } catch (error) {
    console.error("Error al insertar datos ficticios:", error.message);
  } finally {
    await sequelize.close();
    console.log("Conexión cerrada.");
  }
};

insertData();