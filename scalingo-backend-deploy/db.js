const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

const defaultConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  multipleStatements: true,
};

const config = Object.assign({}, defaultConfig);

if (process.env.DATABASE_URL) {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    if (dbUrl.hostname) config.host = dbUrl.hostname;
    if (dbUrl.port) config.port = dbUrl.port;
    if (dbUrl.username) config.user = decodeURIComponent(dbUrl.username);
    if (dbUrl.password) config.password = decodeURIComponent(dbUrl.password);
    if (dbUrl.pathname) config.database = dbUrl.pathname.replace(/^\//, "");

    // If the connection string requests SSL (common on managed DBs), set a basic ssl option.
    // This keeps the pool usage simple; adjust as needed for strict verification.
    const sslParam = dbUrl.searchParams.get("ssl") || dbUrl.searchParams.get("useSSL");
    if (sslParam === "true") {
      config.ssl = { rejectUnauthorized: false };
    }
  } catch (err) {
    console.error("Invalid DATABASE_URL, falling back to DB_* env vars:", err.message);
  }
}

const pool = mysql.createPool(config);

async function initializeDatabase() {
  const candidatePaths = [
    path.join(__dirname, "..", "db", "init.sql"),
    path.join(__dirname, "db", "init.sql"),
  ];

  let initSql;
  for (const candidatePath of candidatePaths) {
    try {
      initSql = await fs.readFile(candidatePath, "utf8");
      break;
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  if (!initSql) {
    throw new Error("init.sql introuvable pour l'initialisation de la base");
  }

  await pool.query(initSql);
}

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
