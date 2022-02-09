const nodes = require('../models/nodes.js');

const transactions_funcs = {
    start_transaction: async function (node) {
        const conn = await nodes.connect_node(node);
        await conn.beginTransaction();
        return conn;
    }
}
module.exports = transactions_funcs;