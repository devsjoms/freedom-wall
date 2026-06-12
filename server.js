const express = require('express');
const app = express();
const db = require('./database/db');
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))


app.post('/submit', async (req, res) => {

    let name = req.body.name;
    const message = req.body.message;

    if (!name) {
        name = "Anonymous";
    }

    const sql = "INSERT INTO messages (name, message) VALUES (?, ?)";

    try {
        await db.query(sql, [name, message]);
        console.log("Message Posted Successfully!");
        res.redirect("/");
    } catch(err) {
        console.error(err);
        res.redirect("/");
    }
});

app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM messages");
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});
console.log({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQLDATABASE
});
app.listen(PORT, () =>{
    console.log(`Using port ${PORT} in localhost open http://localhost:${PORT}`)
});