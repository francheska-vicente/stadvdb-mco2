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
        result = result.slice(0, 50);
        
        var data = {
            uniqueKeys: uniqueKeys,
            result: result
        };
        
        res.render ('home', data);
    }
}

module.exports = controller;