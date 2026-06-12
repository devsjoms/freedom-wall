const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || process.env.HOST;
const user = process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || process.env.USER;
const password = process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || process.env.PASSWORD;
const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_DATABASE || process.env.DATABASE;
const port = process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || process.env.DBPORT;

const poolConfig = {
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

if (port) poolConfig.port = Number(port);

// If DATABASE_URL is provided (Railway-style), parse it.
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

// Enable SSL if provided (useful for managed providers that require TLS)
if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1') {
    poolConfig.ssl = { rejectUnauthorized: false };
}

// Create pool and promise wrapper
const pool = mysql.createPool(poolConfig);
const promisePool = pool.promise();

// Debug output only when DEBUG is set
if (process.env.DEBUG === 'true' || process.env.DEBUG === '1') {
    console.log('DB config:', {
        host: poolConfig.host,
        database: poolConfig.database,
        port: poolConfig.port,
    });
}

pool.getConnection((err, connection) => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('Database connected!');
        connection.release();
    }
});

// Attach an `end` method to the promise pool so callers can close the pool.
promisePool.end = () =>
    new Promise((resolve, reject) => {
        pool.end(err => (err ? reject(err) : resolve()));
    });

module.exports = promisePool;
