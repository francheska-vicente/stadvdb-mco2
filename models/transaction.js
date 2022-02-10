const nodes = require('../models/nodes.js');

const transactions_funcs = {
    make_transaction: async function (node, query) {
        try {
            const conn = await nodes.connect_node(node);
            await conn.beginTransaction();
            var result = await nodes.execute_query(conn, query);
            await conn.commit();
            return result;
        }
        catch (error) {
            console.log(error)
            conn.rollback();
        }
    }
}
module.exports = transactions_funcs;