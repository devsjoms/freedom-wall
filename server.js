const express = require('express');
const app = express();
const db = require('./database/db');

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.post('/submit', async (req, res) => {

    try {

        console.log("POST ROUTE HIT");

        const [result] = await db.query(
            "INSERT INTO messages (name, message) VALUES (?, ?)",
            [
                req.body.name,
                req.body.message
            ]
        );

        console.log(result);

        res.send("INSERT OK");

    } catch(err) {

        console.log(err);

        res.status(500).send(err.message);

    }

});

// GET ALL MESSAGES
app.get('/users', async (req, res) => {

    try {

        const sql = `
            SELECT *
            FROM messages
            ORDER BY id DESC
        `;

        const [result] = await db.query(sql);

        res.json(result);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});