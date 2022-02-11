const { NULL } = require('mysql/lib/protocol/constants/types');
const mysql = require('mysql2/promise');

const db = require('./db.js');
const log = require('./logs.js');
const nodes = require('./nodes.js');
const transaction = require('./transaction.js');
const queryHelper = require('../helpers/queryHelper.js');

const sync_funcs = {
    sync_leader_node: async function () {
        let logs = [];
        let logs2 = [];
        let logs3 = [];
        try {
            logs = await nodes.select_query_follower_node(queryHelper.to_retrieve_logs(1));
            
            logs2 = logs[0][0];
            logs3 = logs[1][0];
            logs = logs2.concat(logs3);
            logs.sort((a, b) => a.date.getTime() - b.date.getTime());
            for (let i = 0; i < logs.length; i++) {
                let query;
                switch (logs[i].type) {
                    case 'INSERT':
                        query = queryHelper.to_insert_query(logs[i].name, logs[i].year, logs[i].rank); break;
                    case 'UPDATE':
                        query = queryHelper.to_update_query(logs[i].id, logs[i].name, logs[i].rank, logs[i].year); break;
                    case 'DELETE':
                        query = queryHelper.to_insert_query(logs[i].id); break;
                }
                console.log(query);
                await transaction.make_transaction(logs[i].node_to, query);
                return await transaction.make_transaction(logs[i].node_from, queryHelper.to_finish_log(logs[i].statement_id));
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
                        query = queryHelper.to_insert_query(logs[i].name, logs[i].year, logs[i].rank); break;
                    case 'UPDATE':
                        query = queryHelper.to_update_query(logs[i].id, logs[i].name, logs[i].rank, logs[i].year); break;
                    case 'DELETE':
                        query = queryHelper.to_insert_query(logs[i].id); break;
                }
                console.log(query);
                await transaction.make_transaction(logs[i].node_to, query);
                return await transaction.make_transaction(logs[i].node_from, queryHelper.to_finish_log(logs[i].statement_id));
            }
        }
        catch (error) {
            console.log(error)
        }
    }
}
module.exports = sync_funcs;