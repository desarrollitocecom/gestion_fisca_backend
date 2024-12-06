require("dotenv").config();
const { Sequelize } = require("sequelize");

const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

// Conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
});

const Rol = require("../models/Rol")(sequelize);
const Permiso = require("../models/Permiso")(sequelize);

// Definición de la relación entre `Rol` y `Permiso`
Rol.belongsToMany(Permiso, { through: "Roles_Permisos", foreignKey: "id_rol" });
Permiso.belongsToMany(Rol, { through: "Roles_Permisos", foreignKey: "id_permiso" });

// Roles y permisos a crear
const rolesPermisos = [
  { nombre: "Area Instructiva", permisos: ["create_ifi"] },
  { nombre: "Analista 2", permisos: ["create_descargo_ifi", "read_ifi"] },
  { nombre: "Area Resolutiva 1", permisos: ["create_rsa", "read_ifi", "create_rsg2"] },
  { nombre: "Area Resolutiva 2", permisos: ["create_rsa", "read_ifi", "create_rsg2"] },
  { nombre: "Analista 3", permisos: ["create_descargo_rsa", "read_rsa"] },
  { nombre: "Area Resolutiva 3", permisos: ["create_rsgp", "read_rsa", "create_rsgnp"] },
  { nombre: "Analista 4", permisos: ["create_descargo_rsgnp", "read_rsgnp"] },
  { nombre: "Gerente", permisos: ["create_rg", "read_rsgnp"] },
  { nombre: "Analista 5", permisos: ["read_rsgnp", "read_rsa", "read_rg", "create_ARSA", "create_ARSGNP", "create_ARG"] },
  { nombre: "Tramite Inspector", permisos: ["read_mc"] },
  { nombre: "Digitador", permisos: ["read_nc", "update_nc"] },
  { nombre: "Analista 1", permisos: ["create_descargo_nc", "update_nc"] },
  { nombre: "Administrador", permisos: ["all_system_access"] },
];

async function createRolesAndAssignPermissions() {
  const transaction = await sequelize.transaction(); 
  try {
    for (const { nombre, permisos } of rolesPermisos) {
      // Crear el rol
      const rol = await Rol.create(
        {
          nombre,
          descripcion: `Rol correspondiente a ${nombre}`,
        },
        { transaction }
      );
      console.log(`✅ Rol "${nombre}" creado con ID: ${rol.id}`);

      // Buscar los permisos por nombre
      const permisosDB = await Permiso.findAll(
        {
          where: { nombre: permisos },
        },
        { transaction }
      );

      if (permisosDB.length === 0) {
        console.log(`⚠️ No se encontraron permisos para el rol "${nombre}".`);
        continue;
      }

      // Asignar los permisos al rol
      await rol.addPermisos(permisosDB, { transaction });
      console.log(`✅ Permisos asignados al rol "${nombre}".`);
    }

    await transaction.commit(); // Confirma la transacción
    console.log("✅ Todos los roles y permisos fueron creados exitosamente.");
  } catch (error) {
    // Si ocurre un error, revertir la transacción
    await transaction.rollback();
    console.error("❌ Error al insertar datos:", error.message);
  } finally {
    // Cierra la conexión a la base de datos
    await sequelize.close();
    console.log("🔒 Conexión cerrada.");
  }
}

// Ejecutar la función
createRolesAndAssignPermissions();
