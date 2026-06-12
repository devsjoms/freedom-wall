const mysql = require("mysql2");
require("dotenv").config();

const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || process.env.HOST;
const user = process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || process.env.USER;
const password = process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || process.env.PASSWORD;
const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_DATABASE || process.env.DATABASE;
const port = process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || process.env.DBPORT || process.env.DBPORT;

const poolConfig = {
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

if (port) {
    poolConfig.port = Number(port);
}

// If Railway or another provider gives a single DATABASE_URL, try to parse it.
if ((!poolConfig.host || !poolConfig.user || !poolConfig.password) && process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        poolConfig.host = url.hostname;
        poolConfig.user = url.username;
        poolConfig.password = url.password;
        if (url.port) poolConfig.port = Number(url.port);
        if (url.pathname) poolConfig.database = url.pathname.replace(/^\//, '');
    } catch (e) {
        console.error('Failed to parse DATABASE_URL:', e);
    }
}

// Helpful non-sensitive debug output (host/port/database only)
console.log('DB config:', {
    host: poolConfig.host,
    database: poolConfig.database,
    port: poolConfig.port
});

const db = mysql.createPool(poolConfig);

db.getConnection((err, connection) => {
    if(err){
        console.error('DB connection error:', err);
    } else {
        console.log("Database connected!");
        connection.release();
    }
});

module.exports = db.promise();
