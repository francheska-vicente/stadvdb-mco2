const { NULL } = require('mysql/lib/protocol/constants/types');
const mysql = require('mysql2/promise');

const nodes = require('../models/nodes.js');

const transactions_funcs = {
    make_transaction: async function (node, query, log) {
        let conn = NULL;
        try {
            conn = await nodes.connect_node(node);
            try {
                await conn.beginTransaction();
                var result = await nodes.execute_query(conn, query);
                console.log('Executed query!');
                await nodes.execute_query(conn, log);
                console.log('Created log!');
                await conn.commit();
                return result;
            }
            catch (error) {
                console.log(error)
                conn.rollback(node);
            }
        }
        catch (error) {
            console.log(error)
        }



    },

    rollback: async function (node) {
        await conn.rollback();
    }
}
module.exports = transactions_funcs;