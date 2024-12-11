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
  { nombre: "Area Instructiva", permisos: ["create_AInstructiva"] },
  { nombre: "Analista 2", permisos: ["create_Analista2", "read_Analista2"] },
  { nombre: "Area Resolutiva 1", permisos: ["create_AResolutiva1", "read_AResolutiva1"] },
  { nombre: "Area Resolutiva 2", permisos: ["create_AResolutiva2", "read_AResolutiva2"] },
  { nombre: "Analista 3", permisos: ["create_Analista3", "read_Analista3"] },
  { nombre: "Area Resolutiva 3", permisos: ["create_AResolutiva3", "read_AResolutiva3"] },
  { nombre: "Analista 4", permisos: ["create_Analista4", "read_Analista4"] },
  { nombre: "Gerente", permisos: ["create_Gerente", "read_Gerente"] },
  { nombre: "Analista 5", permisos: ["read_Analista5", "create_Analista5"] },
  { nombre: "Tramite Inspector", permisos: ["read_mc"] },
  { nombre: "Digitador", permisos: ["read_Digitador", "update_Digitador"] },
  { nombre: "Analista 1", permisos: ["create_Analista1", "update_Analista1","read_Analista1"] },
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
