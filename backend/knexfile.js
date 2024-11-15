module.exports = {
  client: "pg", // Change to your database client (e.g., mysql2, sqlite3)
  connection: {
    host: "pg-a892201-epicare.h.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_cUPy0_YVJWU7ao7mvCC",
    database: "defaultdb",
    port:"16909",
    ssl: {rejectUnauthorized: false},
  },
  migrations: {
    directory: "./migrations", // Folder for migration files
  },
  seeds: {
    directory: "./seeds", // Folder for seed files
  },
};
