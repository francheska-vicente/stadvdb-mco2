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
        var query = queryHelper.to_insert_query(name, rank, year);
        try {
            var log = queryHelper.to_insert_query_log(name, rank, year, 1);
            transaction.make_transaction(1, query).then(value => {
                if (value) console.log('Inserted into Node 1');
                console.log(value);
            });
            if (year < 1980) {
                transaction.make_transaction(2, log).then(value => {
                    if (value) console.log('Created log 2');
                    console.log(value);
                });
            }
            else {

            }
            
        }
        catch (error) {
            console.log(error)
            if (year < 1980) {
                var log = queryHelper.to_insert_query_log(name, rank, year, 2);
                transaction.make_transaction(2, query, log).then(value => {
                    if (value) console.log('Inserted into Node 2');
                    console.log(value);
                });
            }
            else {
                var log = queryHelper.to_insert_query_log(name, rank, year, 3);
                transaction.make_transaction(3, query, log).then(value => {
                    if (value) console.log('Inserted into Node 3');
                    console.log(value);
                });
            }
        }
    },

    update_query: async function (id, name, rank, year) {
        var query = queryHelper.to_update_query(id, name, rank, year);
        try {
            var log = queryHelper.to_update_query_log(id, name, rank, year, 1);
            transaction.make_transaction(1, query, log).then(value => {
                if (value) console.log('Updated in Node 1');
                console.log(value);
            });
        }
        catch (error) {
            console.log(error)
            if (year < 1980) {
                var log = queryHelper.to_update_query_log(id, name, rank, year, 2);
                transaction.make_transaction(2, query, log).then(value => {
                    if (value) console.log('Updated in Node 2');
                    console.log(value);
                });
            }
            else {
                var log = queryHelper.to_update_query_log(id, name, rank, year, 3);
                transaction.make_transaction(3, query, log).then(value => {
                    if (value) console.log('Updated in Node 3');
                    console.log(value);
                }); n.rollback();
            }
        }
    },

    delete_query: async function (id, name, rank, year) {
        var query = queryHelper.to_delete_query(id);
        try {
            var log = queryHelper.to_delete_query_log(id, name, rank, year, 1);
            transaction.make_transaction(3, query, log).then(value => {
                if (value) console.log('Deleted from Node 1');
                console.log(value);
            });
        }
        catch (error) {
            console.log(error)
            if (year < 1980) {
                var log = queryHelper.to_delete_query_log(id, name, rank, year, 2);
                transaction.make_transaction(3, query, log).then(value => {
                    if (value) console.log('Deleted from Node 2');
                    console.log(value);
                });
            }
            else {
                var log = queryHelper.to_delete_query_log(id, name, rank, year, 3);
                transaction.make_transaction(3, query, log).then(value => {
                    if (value) console.log('Deleted from Node 3');
                    console.log(value);
                });
            }
        }
    }
}

module.exports = db_functions;
