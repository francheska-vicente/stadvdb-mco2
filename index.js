require('dotenv').config();

//import the necessary modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routes.js');
const db = require('./models/db.js');
const app = express();

//parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }));
//parse incoming json payload
app.use(express.json());

var port = process.env.PORT;
var hostname = process.env.HOSTNAME;

/* The page should only be accessible once the database is connected. */
app.use('/', routes);
app.listen(process.env.PORT, process.env.HOSTNAME, function () {
    console.log(
        `Server is running at http://${hostname}:${port}`
    );
    //db.connect(1, function (result) { console.log(result) });
    // db.execute_query(`SELECT * FROM movies`).then(data => {
    //     console.log(data);
    // });

    db.insert_query({ name: `Pia was here hehe`, year: 1979, rank: 4.0 }).then(data => {
        console.log(data);
    });
});


module.exports = app;