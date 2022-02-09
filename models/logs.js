const mysql = require('mysql2/promise');

const logs_funcs = {
    // connect to log table?
    connect_log: async function () {
    },

    // select * from logs where logs.done != true order by queued_at, sync_to
    get_unreplicated_rows: async function () {
    },

    // update log.done to true 
    finish_sync: async function() {
    }
};

module.exports = logs_funcs;