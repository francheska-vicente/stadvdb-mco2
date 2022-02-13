const { NULL } = require('mysql/lib/protocol/constants/types');
const mysql = require('mysql2/promise');

const nodes = require('../models/nodes.js');
const queryHelper = require('../helpers/queryHelper.js');

const transactions_funcs = {
    make_transaction_with_log: async function (node, query, log, type, id) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();

                    if (type === 'UPDATE' || type === 'DELETE')
                        await nodes.execute_query(conn, queryHelper.to_select_for_update(id));

                    await nodes.execute_query(conn, `SET @@session.time_zone = "+08:00";`);
                    var result = await nodes.execute_query(conn, query);
                    console.log('Executed query!');
                    
                    var log = await nodes.execute_query(conn, log);
                    console.log('Created log!');
                    
                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rolled back the data.');
                    conn.rollback(node);
                    return error;
                }
            else {
                console.log('Unable to connect!');
            }
        }
        catch (error) {
            console.log(error);
            console.log('Unable to connect!');
            return error;
        }
    },

    make_transaction: async function (node, query, type) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();

                    if (type === 'UPDATE' || type === 'DELETE')
                        await nodes.execute_query(conn, queryHelper.to_select_for_update());

                    await nodes.execute_query(conn, `SET @@session.time_zone = "+08:00";`);

                    var result = await nodes.execute_query(conn, query);
                    console.log('Executed query!');

                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rolled back the data.');
                    conn.rollback(node);
                    return error;
                }
            else {
                console.log('Unable to connect!');
            }
        }
        catch (error) {
            console.log(error);
            console.log('Unable to connect!');
            return error;
        }
    }
}
module.exports = transactions_funcs;