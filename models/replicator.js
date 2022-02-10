const cron = require('node-cron');
const sync = require('./sync.js');

const replicator_funcs = {
    replicate: async function () {
        cron.schedule('5 * * * * *', () => {
            console.log('wow')
            try {
                sync.sync_data(1);
                console.log('Replicated to Node 1!');
            }
            catch (error) {
                console.log(error);
            }
            
            try {
                sync.sync_data(2);
                console.log('Replicated to Node 2!');
            }
            catch (error) {
                console.log(error);
            }

            try {
                sync.sync_data(3);
                console.log('Replicated to Node 3!');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
module.exports = replicator_funcs;