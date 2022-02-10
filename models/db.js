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
            throw `All nodes are inaccessible.`
    },

    insert_query: async function (table, movies) {
        var query = queryHelper.to_insert_query(table, movies);
        try {
            transaction.make_transaction(1, query).then(value => {
                console.log('1 ' + value);
            });
        }
        catch (error) {
            console.log(error)
            if (movies.year < 1980) {
                try {
                    transaction.make_transaction(2, query).then(value => {
                        console.log('2 ' + value);
                    });
                }
                catch (error) {
                    console.log(error)
                    conn.rollback();
                }
            }
            else {
                try {
                    transaction.make_transaction(3, query).then(value => {
                        console.log('3 ' + value);
                    });
                }
                catch (error) {
                    console.log(error)
                    conn.rollback();
                }
            }
        }
    },

    update_query: async function (id, name, rank, year) {
        var query = queryHelper.to_update_query(table, id, name, rank, year);
        try {
            transaction.make_transaction(1, query).then(value => {
                console.log(value);
            });
        }
        catch (error) {
            console.log(error)
            if (movies.year < 1980) {
                try {
                    transaction.make_transaction(2, query).then(value => {
                        console.log(value);
                    });
                }
                catch (error) {
                    console.log(error)
                    conn.rollback();
                }
            }
            else {
                try {
                    transaction.make_transaction(3, query).then(value => {
                        console.log(value);
                    });
                }
                catch (error) {
                    console.log(error)
                    conn.rollback();
                }
            }
        }
    },

    delete_query: async function (id) {
        var query = queryHelper.to_delete_query(table, id);
        try {
            transaction.make_transaction(1, query).then(value => {
                console.log(value);
            });
        }
        catch (error) {
            console.log(error)
            if (movies.year < 1980) {
                try {
                    transaction.make_transaction(2, query).then(value => {
                        console.log(value);
                    });
                }
                catch (error) {
                    console.log(error)
                    conn.rollback();
                }
            }
            else {
                try {
                    transaction.make_transaction(3, query).then(value => {
                        console.log(value);
                    });
                }
                catch (error) {
                    console.log(error)
                    conn.rollback();
                }
            }
        }
    }
}

module.exports = db_functions;
