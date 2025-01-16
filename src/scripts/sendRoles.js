require("dotenv").config();
const { Sequelize } = require("sequelize");

const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

// Conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  // dialectOptions: {
  //   ssl: {
  //     require: true, // Requiere SSL para la conexión
  //     rejectUnauthorized: false // Permite conexiones con certificados no confiables (opcional, dependiendo del entorno)
  //   }
  // }
});

const Rol = require("../api/v1/models/Rol")(sequelize);
const Permiso = require("../api/v1/models/Permiso")(sequelize);

// Definición de la relación entre `Rol` y `Permiso`
Rol.belongsToMany(Permiso, { through: "Roles_Permisos", foreignKey: "id_rol" });
Permiso.belongsToMany(Rol, { through: "Roles_Permisos", foreignKey: "id_permiso" });

// Roles y permisos a crear
const rolesPermisos = [
  { nombre: "Administrador", permisos: ["all_system_access"] },
  { nombre: "Gestor Actas", permisos: ["read_GestorActas", "create_GestorActas", "update_GestorActas"] },
  { nombre: "Inspector", permisos: ["read_Inspector", "create_Inspector", "update_Inspector"] },
  { nombre: "Digitador", permisos: ["read_Digitador", "create_Digitador", "update_Digitador"] },
  { nombre: "Analista NC", permisos: ["read_AnalistaNC", "create_AnalistaNC", "update_AnalistaNC"] },
  { nombre: "Area Instructiva", permisos: ["read_AreaInstructiva", "create_AreaInstructiva", "update_AreaInstructiva"] },
  { nombre: "Area Resolutiva 1", permisos: ["read_AreaResolutiva1", "create_AreaResolutiva1", "update_AreaResolutiva1"] },
  { nombre: "Analista IFI", permisos: ["read_AnalistaIFI", "create_AnalistaIFI", "update_AnalistaIFI"] },
  { nombre: "Area Resolutiva 2", permisos: ["read_AreaResolutiva2", "create_AreaResolutiva2", "update_AreaResolutiva2"] },
  { nombre: "Analista RSA", permisos: ["read_AnalistaRSA", "create_AnalistaRSA", "update_AnalistaRSA"] },
  { nombre: "Area Resolutiva 3", permisos: ["read_AreaResolutiva3", "create_AreaResolutiva3", "update_AreaResolutiva3"] },
  { nombre: "Analista RSG", permisos: ["read_AnalistaRSG", "create_AnalistaRSG", "update_AnalistaRSG"] },
  { nombre: "Gerente", permisos: ["read_Gerencia", "create_Gerencia", "update_Gerencia"] },
  { nombre: "Analista Acta de Concentimiento", permisos: ["read_AnalistaActa", "create_AnalistaActa", "update_AnalistaActa"] },
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
// dialectOptions: {
//   ssl: {
//     require: true, // Requiere SSL para la conexión
//     rejectUnauthorized: false // Permite conexiones con certificados no confiables (opcional, dependiendo del entorno)
//   }
// }