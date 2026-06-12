const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
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
