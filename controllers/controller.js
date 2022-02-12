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
                data = {
                        uniqueKeys: uniqueKeys,
                        result: result,
                        resultlen: resultlen
                }      
                console.log('hello' + data);
                res.render ('home', data);
        }
}

module.exports = controller;