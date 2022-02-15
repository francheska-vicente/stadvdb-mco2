const { NULL } = require('mysql/lib/protocol/constants/types');
const mysql = require('mysql2/promise');

const nodes = require('./nodes.js');
const transaction = require('./transaction.js');
const queryHelper = require('../helpers/queryHelper.js');
const { query_node } = require('./nodes.js');

const sync_funcs = {
    sync_leader_node: async function () {
        let logs = [];
        let logs2 = [];
        let logs3 = [];
        try {
            logs2 = await query_node(2, queryHelper.to_retrieve_logs(1));
            logs3 = await query_node(3, queryHelper.to_retrieve_logs(1));
            if (logs2[0]) logs = logs2[0];
            if (logs3[0] && logs) logs = logs.concat(logs3[0]);
            else if (logs3[0]) logs = logs3[0];

            if (logs) {
                logs.sort((a, b) => a.date.getTime() - b.date.getTime());

                for (let i = 0; i < logs.length; i++) {
                    let query;
                    switch (logs[i].type) {
                        case 'INSERT':
                            query = queryHelper.to_insert_query(logs[i].name, logs[i].rank, logs[i].year);
                            var update = queryHelper.to_finish_log(logs[i].statement_id);
                            var result = await transaction.insert_update_transaction_with_log(logs[i].node_to, query, update, logs[i].node_from);
                            return (result instanceof Error) ? false : true;

                        case 'UPDATE':
                            query = queryHelper.to_update_query(logs[i].id, logs[i].name, logs[i].rank, logs[i].year);
                            var update = queryHelper.to_finish_log(logs[i].statement_id);
                            var result = await transaction.make_2transaction(logs[i].node_to, query, update, 'UPDATE', logs[i].id, logs[i].node_from);
                            return (result instanceof Error) ? false : true;

                        case 'DELETE':
                            query = queryHelper.to_delete_query(logs[i].id);
                            var update = queryHelper.to_finish_log(logs[i].statement_id);
                            var result = await transaction.make_2transaction(logs[i].node_to, query, update, 'DELETE', logs[i].id, logs[i].node_from);
                            return (result instanceof Error) ? false : true;
                    }
                    console.log('Synced to Node 1');
                }
            }

            return true;
        }
        catch (error) {
            console.log(error)
            return false; 
        }
    },

    sync_follower_node: async function (node) {
        let logs = [];
        try {
            logs = await query_node(1, queryHelper.to_retrieve_logs(node));
            logs = logs[0];

            if (logs) {
                for (let i = 0; i < logs.length; i++) {
                    let query;
                    switch (logs[i].type) {
                        case 'INSERT':
                            if (logs[i].id) query = queryHelper.to_insert_query_with_id(logs[i].id, logs[i].name, logs[i].rank, logs[i].year);
                            else query = queryHelper.to_insert_query(logs[i].name, logs[i].rank, logs[i].year); 
                            break;
                        case 'UPDATE':
                            query = queryHelper.to_update_query(logs[i].id, logs[i].name, logs[i].rank, logs[i].year); break;
                        case 'DELETE':
                            query = queryHelper.to_delete_query(logs[i].id); break;
                    }
                    var result = await transaction.insert_update_transaction(logs[i].node_to, query, queryHelper.to_finish_log(logs[i].statement_id), logs[i].node_from);
                    console.log('Synced to Node ' + node);
                    return (result instanceof Error) ? false : true;
                }
            }
            return true;
        }
        catch (error) {
            console.log(error)
        }
    }
}
module.exports = sync_funcs;