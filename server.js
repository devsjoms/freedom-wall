const express = require('express');
const app = express();
const db = require('./database/db');

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

app.listen(3000, () =>{
    console.log("Using port 3000 in localhost open http://localhost:3000")
});