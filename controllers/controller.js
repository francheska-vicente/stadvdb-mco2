const db = require ('../models/db.js');

const controller = {
    getIndex: async function (req, res) {
        let pageNumber = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let start = (pageNumber - 1) * 100;
        let end = 100;

        var arrLength = [];
        arrLength = await db.count_query("SELECT COUNT(*) AS `count` FROM movies;");
        var length = arrLength [0].count;
        
        if (arrLength.length > 1) {
                length = parseInt(arrLength [0].count) + parseInt(arrLength [0].count);
        }

        let query = "SELECT * FROM movies LIMIT " + start + ", " + end + ";";
        console.log(query)
        
        var result = [];
        result = await db.select_query(query);

        var uniqueKeys = result.reduce(function (acc, obj) {
            return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
        }, []);

        result.sort((a, b) => a.id - b.id);
        resultlen = (start + 1) + " to " + (start + end) + " out of " + length;

        var data = {
            uniqueKeys: uniqueKeys,
            result: result,
            resultlen: resultlen,
            pageNumberCurr: pageNumber,
            pageNumberPrev: pageNumber - 1,
            pageNumberNext: pageNumber + 1
        };

        res.render('home', data);
    },

    getQueryResults: async function (req, res) {
        var result = [];
        var query = req.query.query_holder.trim();

        if (query.split(" ")[0].toUpperCase() == 'SELECT') {
            var queryChecker = query.split('FROM')[0].split("\n").join(" ");

            // console.log ("hello" + queryChecker [0] + " " + queryChecker[1] + "hello");
            if (!queryChecker.includes("*\n") && !queryChecker.includes("*")) {
                queryChecker = queryChecker.split(" ").join(',').split(',');
                var checker1 = queryChecker.includes("id");
                var checker2 = queryChecker.includes("ID");
                var checker3 = queryChecker.includes("Id");
                var checker4 = checker = queryChecker.includes("iD");

                if (!(checker1 || checker2 || checker3 || checker4)) {
                    query = query.substring(0, 6) + " id, " + query.substring(6, query.length);
                }

                var position = query.search(/rank/i);
                if (position != -1) {
                    if (query.charAt(position - 1) != '`') {
                        query = query.substring(0, position) + '`rank`' + query.substring(position + 4, query.length);
                    }
                }
            }

            // console.log(query);

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
                console.log("Error in the given MySQL query.");
                res.render('home', err);
            }
        } else {
            console.log('Query not allowed.');
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

    postDeleteMovie: async function (req, res) {
        var id = parseInt(req.params.id);
        var year = parseInt(req.params.year);
        console.log("id: " + id);
        try {
                var result = await db.delete_query(id, year);
                res.redirect('/');
        } catch (err) {
                // this means fail; err holds the error message
        }
    },

    postInsertMovie: async function (req, res) {
        var name = req.body['add-movie-name'];
        var year = req.body['add-movie-year'];
        var rank = req.body['add-movie-rank'];

        if (rank == '') {
                rank = 'null';
        } else {
                rank = parseFloat(rank);
        }

        try {
            const result = await db.insert_query(name, rank, parseInt(year)).then(value => {
                if (value) {
                    // insert successful
                    // temporary: res.redirect()
                    res.redirect('/');
                }
                else {
                    // error oh no
                }
            });
        } catch (err) {}
    }
}

module.exports = controller;