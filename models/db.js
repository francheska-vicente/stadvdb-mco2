// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const mysql = require('mysql2');
const dotenv = require('dotenv');
var fs = require('fs'); // for reading of certificate for connection

dotenv.config(); 

/* configuring the connection to the node */
var nodeConnect;
var path = require('path');
const { NULL } = require('mysql/lib/protocol/constants/types');
// certificate provided by AZURE Database
const serverCa = [fs.readFileSync(path.resolve("models/DigiCertGlobalRootCA.crt.pem"))]; 

const db_funcs = {
    attri: {
        id: 'id',
        name: 'name', 
        year: 'year',
        rank: 'rank'
    },

    // starting a connection with one node
    connect: function (nodeNumber, callback) {
        // switching between nodes
        var connection = {
            port: NULL,
            hostname: NULL
        };

        switch (nodeNumber) 
        {
            case `1`:
                nodeConnect = mysql.createConnection({
                    host: process.env.HOSTNAME1,
                    port: process.env.PORT1,
                    user: process.env.USERNAME1,
                    password: process.env.PASSWORD1,
                    database: process.env.NAME1, 
                    ssl: {
                        rejectUnauthorized: true,
                        ca: serverCa
                    }
                });

                connection.port = process.env.PORT1;
                connection.hostname = process.env.HOSTNAME1;

                    break;
            case `2`:
                nodeConnect = mysql.createConnection({
                    host: process.env.HOSTNAME2,
                    port: process.env.PORT2,
                    user: process.env.USERNAME2,
                    password: process.env.PASSWORD2,
                    database: process.env.NAME2, 
                    ssl: {
                        rejectUnauthorized: true,
                        ca: serverCa
                    }
                });

                connection.port = process.env.PORT2;
                connection.hostname = process.env.HOSTNAME2;

                    break;
            case `3`:
                nodeConnect = mysql.createConnection({
                    host: process.env.HOSTNAME3,
                    port: process.env.PORT3,
                    user: process.env.USERNAME3,
                    password: process.env.PASSWORD3,
                    database: process.env.NAME3, 
                    ssl: {
                        rejectUnauthorized: true,
                        ca: serverCa
                    }
                });

                connection.port = process.env.PORT3;
                connection.hostname = process.env.HOSTNAME3;
                    break;
        }

        nodeConnect.connect();

        callback (connection);
        /*
        nodeConnect.query("SELECT * FROM movies", function (err, result, fields) {
            if (err) return console.error(err)
            console.log(result);
        });
        */
    },

    // for executing a general query in MySQL
    execute_query: function (query, callback) {
        nodeConnect.beginTransaction (function (err) {
            if (err) {
                console.error (`error in beginning transaction:` + err);
                throw err;
            } else {
                nodeConnect.query (query, function (err, result) {
                    if (err) {
                        nodeConnect.rollback (function () {
                            console.error (`error in execute query:` + err);
                            throw err;
                        });
                    } else {
                        nodeConnect.commit (function (err) {
                            if (err) {
                                console.error (`error in committing:` + err);
                                throw err;
                            }
                        });
                    }

                    return callback (result);
                });
            }
        })
    },

    insert: function (movies, callback) {
        var name = `NULL`;
        var rank = `NULL`;
        var year = `NULL`;
       
        if (movies.name) {
            name = movies.name;
        } 

        if (movies.rank) {
            rank = movies.rank;
        }

        if (movies.year) {
            year = movies.year;
        }
        
        var query = `INSERT INTO movies (name, \`rank\`,  year) VALUES ('` + name + `', ` + rank + `, ` + year + `);`
        
        nodeConnect.beginTransaction (function (err) {
            if (err) {
                console.error (`error in beginning transaction:` + err);
                throw err;
            } else {
                nodeConnect.query (query, function (err, result) {
                    if (err) {
                        nodeConnect.rollback (function () {
                            console.error (`error in insert: ` + err);
                            throw err;
                        });
                    } else {
                        nodeConnect.commit (function (err) {
                            if (err) {
                                console.error (`error in committing:` + err);
                                throw err;
                            }
                        });
                    }

                    return callback (result);
                });
            }
        })
    },

    update: function (id, name, rank, year, callback) {
        var query = `UPDATE movies SET`; 
        
        if (name != '') {
            query = query + ` name = '` + name + `'`;

            if (rank != '') {
                query = query + `, \`rank\` = ` + rank;

                if (year != '') {
                    query = query + `, year = ` + year;
                }
            } else if (year != '') {
                query = query + `, year = ` + year;
            }
        } else {
                query = query + ` \`rank\` = ` + rank;
                query = query + `year = ` + year;
        }
        
        query = query + ` WHERE id = ` + id + `;`;

        nodeConnect.beginTransaction (function (err) {
            if (err) {
                console.error (`error in beginning transaction:` + err);
                throw err;
            } else {
                nodeConnect.query (query, function (err, result) {
                    if (err) {
                        nodeConnect.rollback (function () {
                            console.error (`error in update: ` + err);
                            throw err;
                        });
                    } else {
                        nodeConnect.commit (function (err) {
                            if (err) {
                                console.error (`error in committing:` + err);
                                throw err;
                            }
                        });
                    }

                    return callback (result);
                });
            }
        })
    },

    delete: function (id, callback) {
        var query = `DELETE FROM movies WHERE id = ` + id + `;`;

        nodeConnect.beginTransaction (function (err) {
            if (err) {
                console.error (`error in beginning transaction:` + err);
                throw err;
            } else {
                nodeConnect.query (query, function (err, result) {
                    if (err) {
                        nodeConnect.rollback (function () {
                            console.error (`error in delete: ` + err);
                            throw err;
                        });
                    } else {
                        nodeConnect.commit (function (err) {
                            if (err) {
                                console.error (`error in committing:` + err);
                                throw err;
                            }
                        });
                    }

                    return callback (result);
                });
            }
        })
    },

    select: function (select, where, callback) {
        var query = `SELECT `;

        for (var i = 0; i < select.length; i++) {
            if (i != 0) {
                query = query + `, ` + select [i];
            } else {
                query = query + select [i];
            }
        }

        if (select.length == 0) {
            query = query + '*';
        }

        query = query + ` FROM movies `;

        for (var i = 0; i < where.length; i++) {
            if (i != 0) {
                query = query + `, ` + where [i];
            } else {
                query = query + ` WHERE ` + where [i];
            }
        }

        query = query + `;`;

        nodeConnect.query(query, function (err, res) {
            if (err) {
                console.error(`error in select: ` + err);
                throw err;
            } else {
                return callback (res);
            }
        });
    }
};

module.exports = db_funcs;