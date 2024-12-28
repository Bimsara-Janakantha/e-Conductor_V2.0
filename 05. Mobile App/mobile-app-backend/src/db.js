import mysql from "mysql2/promise";
import "dotenv/config";

// DB connection pool
export const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10, // Set a limit for connections
  queueLimit: 0, // No limit on the request queue
});
