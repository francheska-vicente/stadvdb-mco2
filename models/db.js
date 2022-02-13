const { NULL } = require('mysql/lib/protocol/constants/types');
const nodes = require('./nodes.js');
const transaction = require('./transaction.js');
const queryHelper = require('../helpers/queryHelper.js');

const db_functions = {
    select_query: async function (query) {
        try {
            await nodes.connect_node(2);
            await nodes.connect_node(3);
            var rows2 = await transaction.make_transaction(2, query, 'SELECT', '');
            var rows3 = await transaction.make_transaction(3, query, 'SELECT', '');
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

    update_query: async function (id, name, rank, old_year, new_year) {
        // creates SQL statement for updating row
        var query = queryHelper.to_update_query(id, name, rank, new_year);
        var log, log2;

        try {
            // if central node is up, insert row to central node and insert log based on year
            await nodes.connect_node(1);

            // from 2, to 3
            if (new_year >= 1980 && old_year < 1980) {
                log = queryHelper.to_delete_query_log(id, 2, 1);
                log2 = queryHelper.to_insert_query_log(name, new_year, rank, 3, 1);
                var result = transaction.make_transaction_with_log2(1, query, log, log2, 'UPDATE', id);
                return (result instanceof Error) ? false : true;
            }
            // from 3, to 2
            else if (new_year < 1980 && old_year >= 1980) {
                log = queryHelper.to_delete_query_log(id, 3, 1);
                log2 = queryHelper.to_insert_query_log(name, new_year, rank, 2, 1);
                var result = transaction.make_transaction_with_log2(1, query, log, log2, 'UPDATE', id);
                return (result instanceof Error) ? false : true;
            }
            // no change in year
            else {
                if (new_year < 1980)
                    log = queryHelper.to_update_query_log(id, name, new_year, rank, 2, 1);
                else
                    log = queryHelper.to_update_query_log(id, name, new_year, rank, 3, 1);

                var result = transaction.make_transaction_with_log(1, query, log, 'UPDATE', id);
                return (result instanceof Error) ? false : true;
            }

        }
        catch (error) {
            // if central node is down, insert row to follower node based on year
            console.log(error)

            // from 2, to 3
            if (new_year >= 1980 && old_year < 1980) {
                query = queryHelper.to_delete_query(id);
                log = queryHelper.to_update_query_log(id, name, new_year, rank, 1, 2);
                log2 = queryHelper.to_insert_query_log(name, new_year, rank, 3, 2);
                var result = transaction.make_transaction_with_log2(2, query, log, log2, 'UPDATE', id);
                return (result instanceof Error) ? false : true;
            }
            // from 3, to 2
            else if (new_year >= 1980 && old_year < 1980) {
                query = queryHelper.to_delete_query(id);
                log = queryHelper.to_update_query_log(id, name, new_year, rank, 1, 3);
                log2 = queryHelper.to_insert_query_log(name, new_year, rank, 2, 3);
                var result = transaction.make_transaction_with_log2(3, query, log, log2, 'UPDATE', id);
                return (result instanceof Error) ? false : true;
            }
            // no change in year
            else {
                if (year < 1980) {
                    log = queryHelper.to_update_query_log(id, name, new_year, rank, 1, 2);
                    var result = transaction.make_transaction_with_log(2, query, log, 'UPDATE', id);
                    return (result instanceof Error) ? false : true;
                }
                else {
                    log = queryHelper.to_update_query_log(id, new_year, year, rank, 1, 3);
                    var result = transaction.make_transaction_with_log(3, query, log, 'UPDATE', id);
                    return (result instanceof Error) ? false : true;
                }
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