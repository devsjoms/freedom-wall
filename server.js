const express = require('express');
const app = express();
const db = require('./database/db');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))


app.post('/submit', (req, res) => {

    let name = req.body.name;
    const message = req.body.message;

    const sql = "INSERT INTO messages (name, message) VALUES (?, ?)";

    if(!name){
        name = "Anonymous";
    }
    db.query(sql, [name, message], (err, result) => {
        if(err) {
            console.log("Error Posting a Message!")
            console.log(err)
            res.redirect("/")
        } else {
            console.log("Message Posted Succesfully!")
            res.redirect("/")
        }
    });

});


app.get('/users', (req, res) => {

    const sql = "SELECT * FROM messages";

    db.query(sql, (err, result) => {

        if(err){
            res.send("Error");
        } else {
            res.json(result);
        }

    });

});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});