const { NULL } = require('mysql/lib/protocol/constants/types');
const nodes = require('./nodes.js');
const transaction = require('./transaction.js');
const queryHelper = require('../helpers/queryHelper.js');

const db_functions = {
    ping: async function (node) {
        try {
            await nodes.connect_node(node);
            console.log(`Up!`);
        }
        catch (error) {
            console.log(`Down!`);
        }
    },
    
    count_query: async function (query) {
        try {
            await nodes.connect_node(2);
            await nodes.connect_node(3);
            var rows2 = await transaction.get_query_count(query, 2);
            var rows3 = await transaction.get_query_count(query, 3);
            return rows2[0][0].concat(rows3[0][0]);
        }
        catch (error) {
            try {
                console.log(`One or more follower nodes are down.`);
                await nodes.connect_node(1);
                var rows = await transaction.make_transaction(1, query, 'SELECT', '');
                return rows[0];
            }
            catch (error) {
                console.log(`All nodes are inaccessible.`);
            }
        } 
    },

    select_query: async function (query) {
        try {
            await nodes.connect_node(2);
            await nodes.connect_node(3);
            var rows2 = await transaction.make_transaction(2, query, 'SELECT', '');
            var rows3 = await transaction.make_transaction(3, query, 'SELECT', '');
            return rows2[0].concat(rows3[0]);
        }
        catch (error) {
            console.log(error)
            try {
                console.log(`One or more follower nodes are down.`);
                await nodes.connect_node(1);
                var rows = await transaction.make_transaction(1, query, 'SELECT', '');
                return rows[0];
            }
            catch (error) {
                console.log(`All nodes are inaccessible.`);
            }
        } 
    },

    insert_query: async function (name, rank, year) {
        // creates SQL statement for inserting row
        var query = queryHelper.to_insert_query(name, rank, year);
        var log;

        try {
            // if central node is up, insert row to central node and insert log based on year
            await nodes.connect_node(1);

            if (year < 1980)   
                log = queryHelper.to_insert_query_log(name, year, rank, 2, 1);
            else 
                log = queryHelper.to_insert_query_log(name, year, rank, 3, 1);

            var result = transaction.make_transaction_with_log(1, query, log, 'INSERT', '');
            return (result instanceof Error) ? false : true;
        }
        catch (error) {
            // if central node is down, insert row to follower node based on year and insert log to central
            console.log(error)
            
            if (year < 1980) {
                log = queryHelper.to_insert_query_log(name, year, rank, 1, 2);
                var result = transaction.make_transaction_with_log(2, query, log, 'INSERT', '');
                return (result instanceof Error) ? false : true;
            }
            else {
                log = queryHelper.to_insert_query_log(name, year, rank, 1, 3);
                var result = transaction.make_transaction_with_log(3, query, log, 'INSERT', '');
                return (result instanceof Error) ? false : true;
            }
        }
    },

    update_query: async function (id, name, rank, year) {
        // creates SQL statement for updating row
        var query = queryHelper.to_update_query(id, name, rank, year);
        var log;
        
        try {
            // if central node is up, insert row to central node and insert log based on year
            await nodes.connect_node(1);

            if (year < 1980)
                log = queryHelper.to_update_query_log(id, name, year, rank, 2, 1);
            else
                log = queryHelper.to_update_query_log(id, name, year, rank, 3, 1);
            
            var result = transaction.make_transaction_with_log(1, query, log, 'UPDATE', id);
            return (result instanceof Error) ? false : true;
        }
        catch (error) {
            // if central node is down, insert row to follower node based on year
            console.log(error)

            if (year < 1980) {
                log = queryHelper.to_update_query_log(id, name, year, rank, 1, 2);
                var result = transaction.make_transaction_with_log(2, query, log, 'UPDATE', id);
                return (result instanceof Error) ? false : true;
            }
            else {
                log = queryHelper.to_update_query_log(id, name, year, rank, 1, 3);
                var result = transaction.make_transaction_with_log(3, query, log, 'UPDATE', id);
                return (result instanceof Error) ? false : true;
            }
        }
    },

    delete_query: async function (id, year) {
        // creates SQL statement for deleting row
        var query = queryHelper.to_delete_query(id);
        var log;

        try {
            // if central node is up, insert row to central node and insert log based on year
            await nodes.connect_node(1);

            if (year < 1980)
                log = queryHelper.to_delete_query_log(id, 2, 1);
            else
                log = queryHelper.to_delete_query_log(id, 3, 1);

            var result = transaction.make_transaction_with_log(1, query, log, 'DELETE', id);
            return (result instanceof Error) ? false : true;
        }
        catch (error) {
            // if central node is down, insert row to follower node based on year
            console.log(error)

            if (year < 1980) {
                log = queryHelper.to_delete_query_log(id, 1, 2);
                var result = transaction.make_transaction_with_log(2, query, log, 'DELETE', id);
                return (result instanceof Error) ? false : true;
            }
            else {
                log = queryHelper.to_delete_query_log(id, 1, 3);
                var result = transaction.make_transaction_with_log(3, query, log, 'DELETE', id);
                return (result instanceof Error) ? false : true;
            }
        }
    }
}

module.exports = db_functions;