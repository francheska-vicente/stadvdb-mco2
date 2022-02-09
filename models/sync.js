const db = require('./db.js');
const log = require('./logs.js');

const sync_funcs = {
    sync_data: async function () {
        var logs = log.get_unreplicated_rows;
        try {
            for (const log of logs) {
                switch (log.action) {
                    case "UPDATE": await db.update_query(log.data);
                    case "DELETE": await db.delete_query(log.data);
                }
            }
        }
        catch (error) {
            console.log(error)
            throw (error)
        }
    }
}
module.exports = sync_funcs;