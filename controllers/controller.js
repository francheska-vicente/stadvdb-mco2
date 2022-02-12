const db = require ('../models/db.js');
const controller = {
    getIndex: async function (req, res) {
        console.log('hello');
        var result = [];
        result = await db.select_query('SELECT * FROM movies;');
        var uniqueKeys = result.reduce(function (acc, obj) {
            return acc.concat(Object.keys(obj).filter(key => acc.indexOf(key) === -1));
        }, []);  
        result.sort((a, b) => a.id - b.id);
        result = result.slice(0, 3);
        data = {
            uniqueKeys: uniqueKeys,
            result: result
        }      
        console.log('hello' + data);
        res.render ('home', data);
    }
}

module.exports = controller;