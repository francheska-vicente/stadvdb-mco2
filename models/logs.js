const nodes = require('./nodes.js');

const logs_funcs = {
    // update log.done to true 
    finish_sync: async function (node, id) {
        var query = `UPDATE log_table SET done=1 WHERE statement_id=` + id + `;`
        switch (node) {
            case 1: return await Promise.all([node1.query(query)]);
            case 2: return await Promise.all([node2.query(query)]);
            case 3: return await Promise.all([node3.query(query)]);
        }
    }
};

module.exports = logs_funcs;