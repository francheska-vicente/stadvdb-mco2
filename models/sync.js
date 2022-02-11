const { NULL } = require('mysql/lib/protocol/constants/types');

const db = require('./db.js');
const log = require('./logs.js');
const transaction = require('./transaction.js');
const queryHelper = require('../helpers/queryHelper.js');

const sync_funcs = {
    sync_data: async function (node) {
        let conn = NULL;
        try {
            conn = await transaction.start_transaction(node);
            var logs = await log.get_unreplicated_rows(node);
            console.log(logs)
            if (logs)
                for (const log of logs) {
                    switch (log.type) {
                        case "UPDATE":
                            try {
                                await conn.execute_query(queryHelper.to_update_query('log_table', log.id, log.name, log.rank, log.year));
                                log.finish_sync(node, 1);
                            }
                            catch (error) {
                                console.log(error);
                            }
                            break;
                        case "DELETE":
                            try {
                                await conn.execute_query(queryHelper.to_delete_query('log_table', log.id));
                                log.finish_sync(node, 1);
                            }
                            catch (error) {
                                console.log(error);
                            }
                            break;
                    }
                }
        }
        catch (error) {
            console.log(error)
        }
    },

    create_log: async function (node) {
        
    }
}
module.exports = sync_funcs;