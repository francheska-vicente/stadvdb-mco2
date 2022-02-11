const { NULL } = require('mysql/lib/protocol/constants/types');
const nodes = require('./nodes.js');
const transaction = require('./transaction.js');
const queryHelper = require('../helpers/queryHelper.js');

const db_functions = {
    select_query: async function (query) {
        if (nodes.connect_node(2) && nodes.connect_node(3))
            return await nodes.select_query_follower_node(query)
        else if (nodes.connect_node(1))
            return await nodes.select_query_leader_node(query)
        else
            console.log(`All nodes are inaccessible.`);
    },

    insert_query: async function (name, rank, year) {
        // creates SQL statement for inserting row
        var query = queryHelper.to_insert_query(name, rank, year);

        try {
            // if central node is up, insert row to central node
            transaction.make_transaction(1, query).then(value => {
                if (value) console.log('Inserted into Node 1');
                console.log(value);
            });

            // create log for future sync to follower node based on year
            if (year < 1980) {
                var log = queryHelper.to_insert_query_log(name, year, rank, 2, 1);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 2, node_from: 1');
                    console.log(value);
                });
            }
            else {
                var log = queryHelper.to_insert_query_log(name, year, rank, 3, 1);
                transaction.make_transaction(3, log).then(value => {
                    if (value) console.log('Created log: node_to: 3, node_from: 1');
                    console.log(value);
                });
            }
        }
        catch (error) {
            // if central node is down, insert row to follower node based on year
            console.log(error)
            if (year < 1980) {
                transaction.make_transaction(2, query).then(value => {
                    if (value) console.log('Inserted into Node 2');
                    console.log(value);
                });

                // create log for future sync to central node
                var log = queryHelper.to_insert_query_log(name, year, rank, 1, 2);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 1, node_from: 2');
                    console.log(value);
                });
            }
            else {
                transaction.make_transaction(2, query).then(value => {
                    if (value) console.log('Inserted into Node 3');
                    console.log(value);
                });

                // create log for future sync to central node
                var log = queryHelper.to_insert_query_log(name, year, rank, 1, 3);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 1, node_from: 3');
                    console.log(value);
                });
            }
        }
    },

    update_query: async function (id, name, rank, year) {
        // creates SQL statement for updating row
        var query = queryHelper.to_update_query(id, name, rank, year);

        try {
            // if central node is up, update row in central node
            transaction.make_transaction(1, query).then(value => {
                if (value) console.log('Updated in Node 1');
                console.log(value);
            });

            // create log for future sync to follower node based on year
            if (year < 1980) {
                var log = queryHelper.to_update_query_log(id, name, year, rank, 2, 1);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 2, node_from: 1');
                    console.log(value);
                });
            }
            else {
                var log = queryHelper.to_update_query_log(id, name, year, rank, 3, 1);
                transaction.make_transaction(3, log).then(value => {
                    if (value) console.log('Created log: node_to: 3, node_from: 1');
                    console.log(value);
                });
            }
        }
        catch (error) {
            // if central node is down, insert row to follower node based on year
            console.log(error)
            if (year < 1980) {
                transaction.make_transaction(2, query).then(value => {
                    if (value) console.log('Updated in Node 2');
                    console.log(value);
                });

                // create log for future sync to central node
                var log = queryHelper.to_update_query_log(id, name, year, rank, 1, 2);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 1, node_from: 2');
                    console.log(value);
                });
            }
            else {
                transaction.make_transaction(2, query).then(value => {
                    if (value) console.log('Updated in Node 3');
                    console.log(value);
                });

                // create log for future sync to central node
                var log = queryHelper.to_update_query_log(id, name, year, rank, 1, 3);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 1, node_from: 3');
                    console.log(value);
                });
            }
        }
    },

    delete_query: async function (id) {
        // creates SQL statement for deleting row
        var query = queryHelper.to_delete_query(id);

        try {
            // if central node is up, update row in central node
            transaction.make_transaction(1, query).then(value => {
                if (value) console.log('Deleted from Node 1');
                console.log(value);
            });

            // create log for future sync to follower node based on year
            if (year < 1980) {
                var log = queryHelper.to_delete_query_log(id, 2, 1);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 2, node_from: 1');
                    console.log(value);
                });
            }
            else {
                var log = queryHelper.to_delete_query_log(id, 3, 1);
                transaction.make_transaction(3, log).then(value => {
                    if (value) console.log('Created log: node_to: 3, node_from: 1');
                    console.log(value);
                });
            }
        }
        catch (error) {
            // if central node is down, insert row to follower node based on year
            console.log(error)
            if (year < 1980) {
                transaction.make_transaction(2, query).then(value => {
                    if (value) console.log('Deleted from Node 2');
                    console.log(value);
                });

                // create log for future sync to central node
                var log = queryHelper.to_delete_query_log(id, 1, 2);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 1, node_from: 2');
                    console.log(value);
                });
            }
            else {
                transaction.make_transaction(2, query).then(value => {
                    if (value) console.log('Deleted from Node 3');
                    console.log(value);
                });

                // create log for future sync to central node
                var log = queryHelper.to_delete_query_log(id, 1, 3);
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log: node_to: 1, node_from: 3');
                    console.log(value);
                });
            }
        }
    }
}

module.exports = db_functions;
