const mysql = require('mysql2/promise');
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const db = mysql.createPool(process.env.DATABASE_URL);

module.exports = db;