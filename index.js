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

    db.execute_query(`INSERT INTO movies (name, \`rank\`,  year) VALUES ( 'Yohoo', 8.5, 1980);`).then(data => {
        console.log(data);
    });
});


module.exports = app;