const nodes = require('./nodes.js');

const logs_funcs = {
    // select * from logs where logs.done != true order by queued_at, sync_to
    get_unreplicated_rows: async function (node) {
        var query = `SELECT * FROM log_table WHERE done=0 ORDER BY statement_id, node_to;`;
        if (nodes.connect_node(node))
            return await nodes.select_query_node(node, query);
    },

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