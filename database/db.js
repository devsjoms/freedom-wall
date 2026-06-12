const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createPool({
    uri: process.env.MYSQL_PUBLIC_URL
});

module.exports = db;