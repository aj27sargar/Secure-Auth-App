const sql = require('mssql');
require('dotenv').config();

const configMain = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const configClientDB = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: 'ClientDB',
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const poolMain = new sql.ConnectionPool(configMain);
const poolClient = new sql.ConnectionPool(configClientDB);

async function connectDB() {
  try {
    await poolMain.connect();
    console.log('✅ Connected to Main DB');
    await poolClient.connect();
    console.log('✅ Connected to ClientDB');
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  }
}

module.exports = { sql, connectDB, poolMain, poolClient };
