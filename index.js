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

db.connect();

//bind the server to a port and a host
app.listen(process.env.PORT, process.env.HOSTNAME, function () {
    console.log(
        `Server is running at http://${process.env.HOSTNAME}:${process.env.PORT}`
    );
});

module.exports = app;