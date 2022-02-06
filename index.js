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
db.connect(`2`, function (result) {
    //bind the server to a port and a host
    app.listen(process.env.PORT, process.env.HOSTNAME, function () {
        console.log(
            `Server is running at http://${hostname}:${port}`
        );
    });
});

module.exports = app;