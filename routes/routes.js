const express = require('express');
const controller = require('../controllers/controller.js');
const app = express.Router();

app.get('/', controller.getIndex);
app.get('/devMenu', controller.getDevMenu);
app.post('/query-search/results', controller.postQueryResults);
app.post('/delete/:id/:year', controller.postDeleteMovie);
app.post('/add', controller.postInsertMovie);
app.put('/edit/:id', controller.postUpdateMovie);

module.exports = app;