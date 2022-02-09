const { NULL } = require('mysql/lib/protocol/constants/types');
const nodes = require('../models/nodes.js');
const transaction = require('../models/transaction.js');

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
        var name = movies.name;
        var rank = `NULL`;
        var year = movies.year;

        if (movies.rank) {
            rank = movies.rank;
        }

        var query = `INSERT INTO movies (name, \`rank\`,  year) VALUES ('` + name + `', ` + rank + `, ` + year + `);`
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
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
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
                    throw (error)
                }
                finally {
                    try {
                        var result = await nodes.query_pool(conn, query);
                        await conn.commit();
                        return result;
                    }
                    catch (error) {
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
                conn.rollback();
                throw (error);
            }
        }
    }
}

//     } else {
//         node1.beginTransaction(function (err) {
//             if (err) {
//                 if (movies.year < 1980) {
//                     node2.beginTransaction(function (err) {
//                         if (err) {
//                             console.error(`error in beginning transaction:` + err);
//                             throw err;
//                         } else {
//                             node2.query(query, function (err, result) {
//                                 if (err) {
//                                     node2.rollback(function () {
//                                         console.error(`error in query: ` + err);
//                                         throw err;
//                                     });
//                                 } else {
//                                     node2.commit(function (err) {
//                                         if (err) {
//                                             console.error(`error in committing:` + err);
//                                             throw err;
//                                         }
//                                     });
//                                 }
//                                 return callback(result);
//                             });
//                         }
//                     })
//                 } else {
//                     node3.beginTransaction(function (err) {
//                         if (err) {
//                             console.error(`error in beginning transaction:` + err);
//                             throw err;
//                         } else {
//                             node3.query(query, function (err, result) {
//                                 if (err) {
//                                     node3.rollback(function () {
//                                         console.error(`error in query: ` + err);
//                                         throw err;
//                                     });
//                                 } else {
//                                     node3.commit(function (err) {
//                                         if (err) {
//                                             console.error(`error in committing:` + err);
//                                             throw err;
//                                         } else {
//                                             return callback(result);
//                                         }
//                                     });
//                                 }
//                             });
//                         }
//                     })
//                 }
//             } else {
//                 node1.query(query, function (err, result) {
//                     if (err) {
//                         node1.rollback(function () {
//                             console.error(`error in insert: ` + err);
//                             if (movies.year < 1980) {
//                                 node2.beginTransaction(function (err) {
//                                     if (err) {
//                                         console.error(`error in beginning transaction:` + err);
//                                         throw err;
//                                     } else {
//                                         node2.query(query, function (err, result) {
//                                             if (err) {
//                                                 node2.rollback(function () {
//                                                     console.error(`error in query: ` + err);
//                                                     throw err;
//                                                 });
//                                             } else {
//                                                 node2.commit(function (err) {
//                                                     if (err) {
//                                                         console.error(`error in committing:` + err);
//                                                         throw err;
//                                                     }
//                                                 });
//                                             }
//                                             return callback(result);
//                                         });
//                                     }
//                                 })
//                             } else {
//                                 node3.beginTransaction(function (err) {
//                                     if (err) {
//                                         console.error(`error in beginning transaction:` + err);
//                                         throw err;
//                                     } else {
//                                         node3.query(query, function (err, result) {
//                                             if (err) {
//                                                 node2.rollback(function () {
//                                                     console.error(`error in query: ` + err);
//                                                     throw err;
//                                                 });
//                                             } else {
//                                                 node3.commit(function (err) {
//                                                     if (err) {
//                                                         console.error(`error in committing:` + err);
//                                                         throw err;
//                                                     }
//                                                 });
//                                             }
//                                             return callback(result);
//                                         });
//                                     }
//                                 })
//                             }
//                         });
//                     } else {
//                         node1.commit(function (err) {
//                             if (err) {
//                                 if (movies.year < 1980) {
//                                     node2.beginTransaction(function (err) {
//                                         if (err) {
//                                             console.error(`error in beginning transaction:` + err);
//                                             throw err;
//                                         } else {
//                                             node2.query(query, function (err, result) {
//                                                 if (err) {
//                                                     node2.rollback(function () {
//                                                         console.error(`error in query: ` + err);
//                                                         throw err;
//                                                     });
//                                                 } else {
//                                                     node2.commit(function (err) {
//                                                         if (err) {
//                                                             console.error(`error in committing:` + err);
//                                                             throw err;
//                                                         }
//                                                     });
//                                                 }
//                                                 return callback(result);
//                                             });
//                                         }
//                                     })
//                                 } else {
//                                     node3.beginTransaction(function (err) {
//                                         if (err) {
//                                             console.error(`error in beginning transaction:` + err);
//                                             throw err;
//                                         } else {
//                                             node3.query(query, function (err, result) {
//                                                 if (err) {
//                                                     node2.rollback(function () {
//                                                         console.error(`error in query: ` + err);
//                                                         throw err;
//                                                     });
//                                                 } else {
//                                                     node3.commit(function (err) {
//                                                         if (err) {
//                                                             console.error(`error in committing:` + err);
//                                                             throw err;
//                                                         }
//                                                     });
//                                                 }
//                                                 return callback(result);
//                                             });
//                                         }
//                                     })
//                                 }
//                             } else {
//                                 console.log(`data was queried in node1\n.`);
//                                 return callback(result);
//                             }
//                         });
//                     }
//                 });
//             }
//         })
//     }
// } else {
//     var error = `Unauthorized access of the database.`;
//     throw error;
// }

module.exports = db_functions;
