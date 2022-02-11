const cron = require('node-cron');
const sync = require('./sync.js');

const replicator_funcs = {
    replicate: async function () {
        cron.schedule('5 * * * * *', () => {
            console.log('Starting replication!')
            try {
                sync.sync_leader_node();
            }
            catch (error) {
                console.log(error);
            }
            
            try {
                sync.sync_follower_node(2);
            }
            catch (error) {
                console.log(error);
            }

            try {
                sync.sync_follower_node(3);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
module.exports = replicator_funcs;