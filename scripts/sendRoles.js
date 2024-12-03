const { Sequelize, DataTypes } = require("sequelize");

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize("gestion_fiscalizacion", "postgres", "Nissangr34", {
  host: "localhost",
  dialect: "postgres",
});

const Rol = require("../models/Rol")(sequelize);
const Permiso = require("../models/Permiso")(sequelize);



// Definición de la relación entre `Rol` y `Permiso`
Rol.belongsToMany(Permiso, { through: "Roles_Permisos", foreignKey: "id_rol" });
Permiso.belongsToMany(Rol, { through: "Roles_Permisos", foreignKey: "id_permiso" });

/**
 * Función para crear un rol "Admin" y asignarle permisos existentes.
 */
async function createAdminRole() {
  const transaction = await sequelize.transaction();  // Inicia una transacción
  try {
    // Paso 1: Crear el rol "Admin"
    const rolAdmin = await Rol.create({
      nombre: "Administrador", // Nombre del rol
      descripcion: "Rol de administrador", // Descripción del rol
    }, { transaction });

    console.log(`✅ Rol "Admin" creado con ID: ${rolAdmin.id}`);

    // Paso 2: Buscar los permisos por sus IDs
    const permisos = await Permiso.findAll({
      where: {
        id: [75, 18], 
      },
    }, { transaction });
    if (permisos.length === 0) {
      console.log("⚠️  No se encontraron los permisos con los IDs proporcionados.");
      return;
    }

    console.log(`✅ Se encontraron ${permisos.length} permisos.`);
    await rolAdmin.addPermisos(permisos, { transaction });

    await transaction.commit();
    console.log("✅ Permisos asignados correctamente al rol 'Admin'.");

    // Verificar si el rol "Admin" fue creado
    const allRoles = await Rol.findAll();
    console.log("Roles en la base de datos:", allRoles);

    // Verificar los permisos asociados
    const rolesPermisos = await rolAdmin.getPermisos();
    console.log("Permisos asociados al rol 'Admin':", rolesPermisos.map(p => p.nombre));

  } catch (error) {
    // Si ocurre un error, revertir la transacción
    await transaction.rollback();
    console.error("❌ Error al insertar datos:", error.message);
  } finally {
    // Cerramos la conexión a la base de datos
    await sequelize.close();
    console.log("🔒 Conexión cerrada.");
  }
}

// Ejecutar la función para crear el rol y asignar permisos
createAdminRole();
