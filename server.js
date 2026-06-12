const express = require('express');
const app = express();
const db = require('./database/db');

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// POST MESSAGE
app.post('/submit', async (req, res) => {

    try {

        let name = req.body.name;
        const message = req.body.message;

        if (!name) {
            name = "Anonymous";
        }

        const sql = `
            INSERT INTO messages (name, message)
            VALUES (?, ?)
        `;

        await db.query(sql, [name, message]);

        console.log("Message Posted Successfully!");

        res.redirect('/');

    } catch (err) {

        console.log("Error Posting Message");
        console.log(err);

        res.redirect('/');
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