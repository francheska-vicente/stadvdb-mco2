const db = require('../models/db.js');

const controller = {
    getIndex: async function (req, res) {
        let pageNumber = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let start = (pageNumber - 1) * 200;
        let end = 200;
        var arrLength = [];

        arrLength = await db.execute_query("SELECT COUNT(*) AS `count` FROM movies;");
        var length = arrLength[0].count;

        if (arrLength.length > 1) {
            length = parseInt(arrLength[0].count) + parseInt(arrLength[1].count);
        }

        let query = "SELECT * FROM movies;";

        var result = [];
        result = await db.select_query(query);
        console.log("length: " + result.length);

        var uniqueKeys = result.reduce(function (acc, obj) {
            return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
        }, []);
        result.sort((a, b) => a.id - b.id);
        result = result.slice(start, start + end);
        end = result.length;
        resultlen = (start + 1) + " to " + (start + end) + " out of " + length;

        var lastPage = Math.ceil(length / 200)

        var data = {
            uniqueKeys: uniqueKeys,
            result: result,
            resultlen: resultlen,
            pageNumberCurr: pageNumber,
            pageNumberPrev: pageNumber - 1,
            pageNumberNext: pageNumber + 1,
            pageNumberLast: lastPage
        };
        res.render('home', data);
    },

    getDevMenu: async function (req, res) {
        let pageNumber = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let start = (pageNumber - 1) * 100;
        let end = 100;
        console.log('devmenu devmenu')
        var arrLength = [];
        arrLength = await db.execute_query("SELECT COUNT(*) AS `count` FROM movies;");
        var length = arrLength[0].count;

        if (arrLength.length > 1) {
            length = parseInt(arrLength[0].count) + parseInt(arrLength[0].count);
        }

        let query = "SELECT * FROM movies LIMIT " + start + ", " + end + ";";
        console.log(query)

        var result = [];
        result = await db.select_query(query);

        var uniqueKeys = result.reduce(function (acc, obj) {
            return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
        }, []);

        result.sort((a, b) => a.id - b.id);

        end = result.length;
        resultlen = (start + 1) + " to " + (start + end) + " out of " + length;

        var lastPage = Math.ceil(length / 100);

        var data = {
            uniqueKeys: uniqueKeys,
            result: result,
            resultlen: resultlen,
            pageNumberCurr: pageNumber,
            pageNumberPrev: pageNumber - 1,
            pageNumberNext: pageNumber + 1,
            pageNumberLast: lastPage
        };

        res.render('devMenu', data);
    },

    getQueryResults: async function (req, res) {
        var query1 = JSON.stringify(req.body);
        console.log('skupbapbap ' +query1);
        var query = query1.queryholder.trim();
        console.log('hehehe ' + query)
        if (query.substring(0, 6).toUpperCase() == 'SELECT') {
            let pageNumber = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
            let start = (pageNumber - 1) * 200;
            let end = 200;
            var arrLength = [];

            var result = [];
            try {
                result = await db.select_query(query);
                console.log("length: " + result.length);

                var uniqueKeys = result.reduce(function (acc, obj) {
                    return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
                }, []);

                result = result.slice(start, start + end);
                end = result.length;
                resultlen = (start + 1) + " to " + (start + end) + " out of " + length;

                var lastPage = Math.ceil(length / 200)

                var data = {
                    uniqueKeys: uniqueKeys,
                    result: result,
                    resultlen: resultlen,
                    pageNumberCurr: pageNumber,
                    pageNumberPrev: pageNumber - 1,
                    pageNumberNext: pageNumber + 1,
                    pageNumberLast: lastPage,
                    status: true,
                    msg: 'Successfully executed the query!'

                };
                res.send(data);
            } catch (err) {
                var data = {
                    status: false,
                    msg: 'Oh no! Failed to excute the query!'

                };
                res.send(data);
            }
        } else {
            try {
                // kapag hindi select query, wala namang irereturn na table satin, so 
                // probably return a successful message chuchu lang
                result = await db.execute_query(query);
                var data = {
                    result: result,
                    status: true,
                    msg: 'Successfully executed the query!'

                };
                res.send(data);
            } catch (err) {
                var data = {
                    status: false,
                    msg: 'Oh no! Failed to excute the query!'
                };
                res.send(data);
            }
        }
    },

    postUpdateMovie: async function (req, res) {
        const { id } = req.params;
        const {
            old_name,
            new_name,
            old_year,
            new_year,
            old_rank,
            new_rank
        } = req.body;

        var name = '';
        var year = '';
        var rank = '';


        if (old_name != new_name) {
            name = new_name;
        }

        if (old_year != new_year) {
            year = parseInt(new_year);
        }

        if (old_rank != new_rank) {
            rank = parseFloat(new_rank);
        }

        if ((old_year >= 1980 && new_year < 1980) || (old_year < 1980 && new_year >= 1980)) {
            name = new_name;
        }

        console.log("hello: " + name + year + rank);
        try {
            var result = await db.update_query(parseInt(id), name, rank, old_year, new_year);
            var data = {
                result: result,
                status: true,
                msg: 'Update transaction has been recorded!'
            };
            // this means successful
            res.send(data);
        } catch (err) {
            var data = {
                status: false,
                msg: 'Oh no! Update transaction failed.'
            }
            res.send(data)
            // this means fail; err holds the error message
        }
    },

    postDeleteMovie: async function (req, res) {
        var id = parseInt(req.params.id);
        var year = parseInt(req.params.year);
        console.log("id: " + id);
        try {
            var result = await db.delete_query(id, year);
            var data = {
                result: result,
                status: true,
                msg: 'Success! Movie has been deleted!'
            };
            res.send(data);
        } catch (err) {
            // this means fail; err holds the error message
            var data = {
                status: false,
                msg: 'Oh no! Deleting a movie failed.'
            }
            res.send(data);
        }
    },

    postInsertMovie: async function (req, res) {
        var name = req.body.name;
        var year = req.body.year;
        var rank = req.body.rank;
        if (rank == '') {
            rank = 'null';
        } else {
            rank = parseFloat(rank);
        }

        try {
            const result = await db.insert_query(name, rank, parseInt(year))
            if (result) {
                var data = {
                    result: result,
                    status: true,
                    msg: 'Success! Movie has been added!'
                };
                res.send(data);
            }
            else {
                var data = {
                    status: false,
                    msg: 'Oh no! Insert transaction failed.'
                }
                res.send(data);
            }
        } catch (err) { }
    }
}
module.exports = controller;