const { NULL } = require('mysql/lib/protocol/constants/types');
const mysql = require('mysql2/promise');

const nodes = require('./nodes.js');
const transaction = require('./transaction.js');
const queryHelper = require('../helpers/queryHelper.js');

const sync_funcs = {
    sync_leader_node: async function () {
        let logs = [];
        try {
            var logs2 = await transaction.make_transaction(2, queryHelper.to_retrieve_logs(1), 'SELECT', '');
            var logs3 = await transaction.make_transaction(3, queryHelper.to_retrieve_logs(1), 'SELECT', '');
            logs = logs2[0][0].concat(logs3[0][0]);
            logs.sort((a, b) => a.date.getTime() - b.date.getTime());

            for (let i = 0; i < logs.length; i++) {
                let query;
                switch (logs[i].type) {
                    case 'INSERT':
                        var id = await transaction.make_transaction(logs[i].node_to, queryHelper.to_get_next_id());
                        id = id[0][0].AUTO_INCREMENT;
                        query = queryHelper.to_insert_query(logs[i].name, logs[i].rank, logs[i].year); 
                        var log = queryHelper.to_update_query_log(id, logs[i].name, logs[i].year, logs[i].rank, logs[i].node_from, 1); 
                        var result = await transaction.make_2transaction_with_log(logs[i].node_to, query, query2, log, 'INSERT', '');
                        return (result instanceof Error) ? false : true;

                    case 'UPDATE':
                        query = queryHelper.to_update_query(logs[i].id, logs[i].name, logs[i].rank, logs[i].year); 
                        var query2 = queryHelper.to_finish_log(logs[i].statement_id);
                        var result =  await transaction.make_2transaction(logs[i].node_to, query, query2, 'UPDATE', id);
                        return (result instanceof Error) ? false : true;

                    case 'DELETE':
                        query = queryHelper.to_delete_query(logs[i].id); 
                        var query2 = queryHelper.to_finish_log(logs[i].statement_id);
                        var result = await transaction.make_2transaction(logs[i].node_to, query, query2, 'DELETE', id);
                        return (result instanceof Error) ? false : true;
                }
                
            }
        }
        catch (error) {
            console.log(error)
        }
    },

    sync_follower_node: async function (node) {
        let logs = [];
        try {
            logs = await nodes.select_query_leader_node(queryHelper.to_retrieve_logs(node));
            logs = logs[0][0];

            for (let i = 0; i < logs.length; i++) {
                let query;
                switch (logs[i].type) {
                    case 'INSERT':
                        query = queryHelper.to_insert_query(logs[i].name, logs[i].rank, logs[i].year); break;
                    case 'UPDATE':
                        query = queryHelper.to_update_query(logs[i].id, logs[i].name, logs[i].rank, logs[i].year); break;
                    case 'DELETE':
                        query = queryHelper.to_delete_query(logs[i].id); break;
                }
                var result = await transaction.make_2transaction(logs[i].node_to, query, queryHelper.to_finish_log(logs[i].statement_id), '', '');
                return (result instanceof Error) ? false : true;
            }
        }
        catch (error) {
            console.log(error)
        }
    }
}
module.exports = sync_funcs;