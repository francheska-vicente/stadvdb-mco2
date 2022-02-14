const express = require('express');
const controller = require('../controllers/controller.js');
const app = express.Router();

app.get('/', controller.getIndex);
app.get('/query-search/results', controller.getQueryResults);
app.post('/delete/:id/:year', controller.postDeleteMovie);
app.post('/add', controller.postInsertMovie);

module.exports = app;