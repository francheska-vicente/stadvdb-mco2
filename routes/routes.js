const express = require('express');
const controller = require('../controllers/controller.js');
const app = express.Router();

app.get('/', controller.getIndex);
// app.get('/:pageNumber', controller.getPage);
app.get('/query-search/results', controller.getQueryResults);
app.post('/delete/:id/:year', controller.postDeleteMovie);

module.exports = app;