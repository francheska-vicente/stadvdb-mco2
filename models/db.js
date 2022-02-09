const { NULL } = require('mysql/lib/protocol/constants/types');
const nodes = require('../models/nodes.js');
const transaction = require('../models/transaction.js');
const queryHelper = require('../models/queryHelper.js');

const db_functions = {
    select_query: async function (query) {
        if (nodes.connect_node(2) && nodes.connect_node(3))
            return await nodes.select_query_follower_node(query)
        else if (nodes.connect_node(1))
            return await nodes.select_query_leader_node(query)
        else
            throw `All nodes are inaccessible.`
    },

    insert_query: async function (movies) {
        var query = queryHelper.to_insert_query(movies);
        let conn = NULL;
        try {
            conn = await transaction.start_transaction(1);
        }
        catch (error) {
            console.log(error)
            if (movies.year < 1980) {
                try {
                    conn = await transaction.start_transaction(2);
                }
                catch (error) {
                    console.log(error)
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
                        console.log(error)
                        conn.rollback();
                        throw (error);
                    }
                }
            }
            else {
                try {
                    conn = await transaction.start_transaction(2);
                }
                catch (error) {
                    console.log(error)
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
                        console.log(error)
                        conn.rollback();
                        throw (error);
                    }
                }
            }
        }
        finally {
            try {
                var result = await nodes.query_pool(conn, query);
                await conn.commit();
                return result;
            }
            catch (error) {
                console.log(error)
                conn.rollback();
                throw (error);
            }
        }
    },

    update_query: async function (id, name, rank, year) {
        var query = queryHelper.to_update_query(id, name, rank, year);
        let conn = NULL;
        try {
            conn = await transaction.start_transaction(1);
        }
        catch (error) {
            console.log(error)
            if (movies.year < 1980) {
                try {
                    conn = await transaction.start_transaction(2);
                }
                catch (error) {
                    console.log(error)
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
                        console.log(error)
                        conn.rollback();
                        throw (error);
                    }
                }
            }
            else {
                try {
                    conn = await transaction.start_transaction(2);
                }
                catch (error) {
                    console.log(error)
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
                        console.log(error)
                        conn.rollback();
                        throw (error);
                    }
                }
            }
        }
        finally {
            try {
                var result = await nodes.query_pool(conn, query);
                await conn.commit();
                return result;
            }
            catch (error) {
                console.log(error)
                conn.rollback();
                throw (error);
            }
        }
    },

    delete_query: async function (id, name, rank, year) {
        var query = queryHelper.to_delete_query(id);
        let conn = NULL;
        try {
            conn = await transaction.start_transaction(1);
        }
        catch (error) {
            console.log(error)
            if (movies.year < 1980) {
                try {
                    conn = await transaction.start_transaction(2);
                }
                catch (error) {
                    console.log(error)
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
                        console.log(error)
                        conn.rollback();
                        throw (error);
                    }
                }
            }
            else {
                try {
                    conn = await transaction.start_transaction(2);
                }
                catch (error) {
                    console.log(error)
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
                        console.log(error)
                        conn.rollback();
                        throw (error);
                    }
                }
            }
        }
        finally {
            try {
                var result = await nodes.query_pool(conn, query);
                await conn.commit();
                return result;
            }
            catch (error) {
                console.log(error)
                conn.rollback();
                throw (error);
            }
        }
    }
}

module.exports = db_functions;
