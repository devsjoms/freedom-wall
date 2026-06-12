const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if(err){
        console.error(err);
    } else {
        console.log("Database connected!");
        connection.release();
    }
});

module.exports = db.promise();
