const express = require('express');
const app = express();
const db = require('./database/db');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))


app.post('/submit', async (req, res) => {
    let name = req.body.name || 'Anonymous';
    const message = req.body.message;

    const sql = "INSERT INTO messages (name, message) VALUES (?, ?)";

    try {
        const [result] = await db.query(sql, [name, message]);
        console.log("Message Posted Successfully!");
        res.redirect("/");
    } catch (err) {
        console.error("Error Posting a Message!", err);
        res.redirect("/");
    }
});


app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
            console.error('GET /users error:', err);
            const payload = { error: err.message };
            if (process.env.DEBUG === 'true' || process.env.DEBUG === '1') {
                payload.stack = err.stack;
            }
            res.status(500).json(payload);
    }
});

// DB connectivity check endpoint (returns 200 with a small query result or 500 with error info)
app.get('/dbcheck', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS ok');
        res.json({ ok: true, rows });
    } catch (err) {
        console.error('GET /dbcheck error:', err);
        res.status(500).json({ ok: false, error: err.message, code: err.code });
    }
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});