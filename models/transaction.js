const { NULL } = require('mysql/lib/protocol/constants/types');
const mysql = require('mysql2/promise');

const nodes = require('../models/nodes.js');

const transactions_funcs = {
    make_transaction: async function (node, query) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();
                    var result = await nodes.execute_query(conn, query);
                    console.log('Executed query!');
                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rollbacking data!')
                    conn.rollback(node);
                }
            else {
                console.log('Unable to connect!')
            }
        }
        catch (error) {
            console.log(error)
            console.log('Unable to connect!')
        }
    },

    rollback: async function (node) {
        await conn.rollback();
    }
}
module.exports = transactions_funcs;