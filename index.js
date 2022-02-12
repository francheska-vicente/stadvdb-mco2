require('dotenv').config();

//import the necessary modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routes.js');
const db = require('./models/db.js');
const repl = require('./models/replicator.js');
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
    console.log(`Server is running at http://${hostname}:${port}`);
    
    repl.replicate();
    
});


module.exports = app;