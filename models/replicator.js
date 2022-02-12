const cron = require('node-cron');
const sync = require('./sync.js');

let is_replicating_1 = false;
let is_replicating_2 = false;
let is_replicating_3 = false;

const replicator_funcs = {
    replicate: async function () {
        console.log('Scheduling replication!')
        cron.schedule('*/5 * * * * *', () => {
            console.log('Starting replication!')
            if (!is_replicating_1)
                try {
                    is_replicating_1 = true;
                    sync.sync_leader_node();
                    is_replicating_1 = false;
                }
                catch (error) {
                    console.log(error);
                }

            if (!is_replicating_2)
                try {
                    is_replicating_2 = true;
                    sync.sync_follower_node(2);
                    is_replicating_2 = false;
                }
                catch (error) {
                    console.log(error);
                }
                
            if (!is_replicating_3)
                try {
                    is_replicating_3 = true;
                    sync.sync_follower_node(3);
                    is_replicating_3 = false;
                }
                catch (error) {
                    console.log(error);
                }
        });
    }
}
module.exports = replicator_funcs;