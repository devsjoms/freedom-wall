const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    waitForConnections: true,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if(err){
        console.error(err);
    } else {
        console.log("Database connected!");
        connection.release();
    }
});

module.exports = db;