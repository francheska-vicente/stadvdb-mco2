const db = require ('../models/db.js');
const controller = {
        getIndex: async function (req, res) {
                var result = [];
                var query = `SELECT * FROM movies;`
                result = await db.select_query(query);
                
                var uniqueKeys = result.reduce(function (acc, obj) {
                        return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
                }, []);  
                
                result.sort((a, b) => a.id - b.id);
                resultlen = result.length;
                result = result.slice(0, 50);
                
                var data = {
                        uniqueKeys: uniqueKeys,
                        result: result,
                        resultlen: resultlen
                };

                res.render ('home', data);
        },

        getQueryResults: async function (req, res) {
                var result = [];
                var query = req.query.query_holder;

                if (query.trim().split(" ")[0].toUpperCase () == 'SELECT') {
                        try {
                                result = await db.select_query(query);

                                var uniqueKeys = result.reduce(function (acc, obj) {
                                        return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
                                }, []);  
                                
                                resultlen = result.length;
                                result = result.slice(0, 50);
                                
                                var data = {
                                        uniqueKeys: uniqueKeys,
                                        result: result,
                                        resultlen: resultlen
                                };
                                res.render('home', data);
                        } catch (err) {
                                console.log ("Error in the given MySQL query.");
                                res.render('home', err);
                        }                        
                } else {
                        console.log ('Query not allowed.');
                        var error = "Only SELECT queries can be executed."
                        res.render('home', error);
                }
        },

        updateMovie: async function (req, res) {
                var old_name = req.body.old_name;
                var new_name = req.body.new_name;
                var old_year = req.body.old_year;
                var new_year = req.body.new_year;
                var old_rank = req.body.old_rank;
                var new_rank = req.body.new_rank;
                
                var id = req.body.id;
                var rank = '';
                var name = '';
                var year = '';

                if (old_name != new_name) {
                        name = new_name;
                }

                if (old_year != new_year) {
                        year = new_year;
                }

                if (old_rank != new_rank) {
                        rank = new_rank;
                }

                try {
                        var result = await db.update_query(id, name, rank, year);
                        // this means successful
                } catch (err) {
                        // this means fail; err holds the error message
                }
        },

        deleteMovie: async function (req, res) {
                var id = req.body.id;

                try {
                        var result = await db.delete_query(id);
                        // this means successful
                } catch (err) {
                        // this means fail; err holds the error message
                }
        },

        insertMovie: async function (req, res) {
                var name = req.body.name;
                var year = req.body.year;
                var rank = req.body.rank;

                try {
                        var result = db.insert_query(name, rank, year);
                        // this means successful
                } catch (err) {
                        // this means fail; err holds the error message
                }
        }
}

module.exports = controller;