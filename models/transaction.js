const { NULL } = require('mysql/lib/protocol/constants/types');
const mysql = require('mysql2/promise');

const nodes = require('../models/nodes.js');
const queryHelper = require('../helpers/queryHelper.js');

const transactions_funcs = {
    make_2transaction_with_log: async function (node, query, query2, log, type, id) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();

                    if (type === 'UPDATE' || type === 'DELETE')
                        await conn.query(queryHelper.to_select_for_update(id));

                    await conn.query(`SET @@session.time_zone = "+08:00";`);
                    var result = await conn.query(query);
                    console.log('Executed query!');

                    var result2 = await conn.query(query2);
                    console.log('Executed query!');

                    var resultlog = await conn.query(log);
                    console.log('Created ' + log);

                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rolled back the data.');
                    conn.rollback(node);
                    conn.release();
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

    make_2transaction: async function (node, query, query2, type, id) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();

                    if (type === 'UPDATE' || type === 'DELETE')
                        await conn.query(queryHelper.to_select_for_update(id));

                    await conn.query(`SET @@session.time_zone = "+08:00";`);
                    var result = await conn.query(query);
                    console.log('Executed ' + query);

                    var result2 = await conn.query(query2);
                    console.log('Executed ' + query);

                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rolled back the data.');
                    conn.rollback(node);
                    conn.release();
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

    make_transaction_with_log2: async function (node, query, log, log2, type, id) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();

                    if (type === 'UPDATE' || type === 'DELETE')
                        await conn.query(queryHelper.to_select_for_update(id));

                    await conn.query(`SET @@session.time_zone = "+08:00";`);
                    var result = await conn.query(query);
                    console.log('Executed ' + query);

                    var resultlog = await conn.query(log);
                    console.log('Created ' + log);

                    var resultlog = await conn.query(log2);
                    console.log('Created ' + log);

                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rolled back the data.');
                    conn.rollback(node);
                    conn.release();
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

    make_transaction_with_log: async function (node, query, log, type, id) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();

                    if (type === 'UPDATE' || type === 'DELETE')
                        await conn.query(queryHelper.to_select_for_update(id));

                    await conn.query(`SET @@session.time_zone = "+08:00";`);
                    var result = await conn.query(query);
                    console.log('Executed ' + query);

                    var resultlog = await conn.query(log);
                    console.log('Created ' + log);

                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rolled back the data.');
                    conn.rollback(node);
                    conn.release();
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

    make_transaction: async function (node, query, type, id) {
        try {
            let conn = await nodes.connect_node(node);
            if (conn)
                try {
                    await conn.beginTransaction();

                    if (type === 'UPDATE' || type === 'DELETE')
                        await conn.query(queryHelper.to_select_for_update(id));

                    await conn.query(`SET @@session.time_zone = "+08:00";`);

                    var result = await conn.query(query);
                    console.log('Executed ' + query);

                    await conn.commit();
                    await conn.release();
                    return result;
                }
                catch (error) {
                    console.log(error)
                    console.log('Rolled back the data.');
                    conn.rollback(node);
                    conn.release();
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