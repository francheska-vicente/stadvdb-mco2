require('dotenv').config();

//import the necessary modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const handlebars_helper = require(`./views/hbs-helper.js`);
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

//set the file path containing the static assets
app.use(express.static(path.join(__dirname, 'public')));
//set hbs as the view engine
app.set('view engine', 'hbs');
//set the file path containing the hbs files
app.set('views', path.join(__dirname, 'views'));
//set the file path containing the partial hbs files
hbs.registerPartials(path.join(__dirname, 'views/partials'));
/* The page should only be accessible once the database is connected. */
app.use('/', routes);
app.listen(process.env.PORT, process.env.HOSTNAME, function () {
    console.log(`Server is running at http://${hostname}:${port}`);
    // db.insert_query(`Pia was here hehe`, 1979, 4.0).then(data => {
    //     console.log(data);
    // });
    //sync.sync_leader_node();
    //db.insert_query('raur', 1990, 4)
    //sync.sync_follower_node(2);
    //repl.replicate();
});


module.exports = app;