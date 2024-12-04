const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  client: "pg", // Change to your database client (e.g., mysql2, sqlite3)
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {rejectUnauthorized: false},
  },
  migrations: {
    directory: "./migrations", // Folder for migration files
  },
  seeds: {
    directory: "./seeds", // Folder for seed files
  },
};
