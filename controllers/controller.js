const db = require ('../models/db.js');
const controller = {
        getIndex: async function (req, res) {
                var result = [];
                var query = `SELECT * FROM movies;`
                result = await db.select_query(query);
                
                var uniqueKeys = result.reduce(function (acc, obj) {
                        return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
                }, []);  
                
                result = result.sort((a, b) => a.id - b.id);
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
                                var error = "Error in the given MySQL query."
                                res.render('home', error);
                        }                        
                } else {
                        console.log ('Query not allowed.');
                        var error = "Only SELECT queries can be executed."
                        res.render('home', error);
                }
        },

        updateMovie: async function (req, res) {
                
        }
}

module.exports = controller;