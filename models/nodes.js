// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
var fs = require('fs'); // for reading of certificate for connection

dotenv.config(); 

var path = require('path');
const { NULL } = require('mysql/lib/protocol/constants/types');
const e = require('express');
// certificate provided by AZURE Database
const serverCa = [fs.readFileSync(path.resolve("models/DigiCertGlobalRootCA.crt.pem"))]; 

/* configuring the connection to the node */

const node1 = mysql.createPool({
    host: process.env.HOSTNAME1,
    port: process.env.PORT1,
    user: process.env.USERNAME1,
    password: process.env.PASSWORD1,
    database: process.env.NAME1,
    connectTimeout: 5000,
    acquireTimeout: 5000,
    waitForConnections: true,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
});

const node2 = mysql.createPool({
    host: process.env.HOSTNAME2,
    port: process.env.PORT2,
    user: process.env.USERNAME2,
    password: process.env.PASSWORD2,
    database: process.env.NAME2,
    connectTimeout: 5000,
    acquireTimeout: 5000,
    waitForConnections: true,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
});

const node3 = mysql.createPool({
    host: process.env.HOSTNAME3,
    port: process.env.PORT3,
    user: process.env.USERNAME3,
    password: process.env.PASSWORD3,
    database: process.env.NAME3,
    connectTimeout: 5000,
    acquireTimeout: 5000,
    waitForConnections: true,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
});

const nodes_funcs = {
    attri: {
        id: 'id',
        name: 'name', 
        year: 'year',
        rank: 'rank'
    },

    // starting a connection with the nodes
    connect_node: async function (node, callback) {
        switch (node) {
            case 1: return await node1.getConnection();
            case 2: return await node2.getConnection();
            case 3: return await node3.getConnection();
        }
    },

    // for executing a general query in MySQL
    select_query_leader_node: async function (query) {
        return await Promise.all([node1.query(query)]);
    },

    select_query_follower_node: async function (query) {
        return await Promise.all([node2.query(query), node3.query(query)]);
    },

    select_query_node: async function (node, query) {
        switch (node) {
            case 1: return await Promise.all([node1.query(query)]);
            case 2: return await Promise.all([node2.query(query)]);
            case 3: return await Promise.all([node3.query(query)]);
        }
    },

    query_pool: async function (conn, query) {
        return await conn.query(query);
    },

    insert: function (movies, callback) {
        var name = movies.name;
        var rank = `NULL`;
        var year = movies.year;

        if (movies.rank) {
            rank = movies.rank;
        }
        
        var query = `INSERT INTO movies (name, \`rank\`,  year) VALUES ('` + name + `', ` + rank + `, ` + year + `);`

        node1.beginTransaction (function (err) {
            if (err) {
                if (movies.year < 1980) {
                    node2.beginTransaction (function (err) {
                        if (err) {
                            console.error (`error in beginning transaction:` + err);
                            throw err;
                        } else {
                            node2.query (query, function (err, result) {
                                if (err) {
                                    node2.rollback (function () {
                                        console.error (`error in inserting: ` + err);
                                        throw err;
                                    });
                                } else {
                                    node2.commit (function (err) {
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
                } else {
                    node3.beginTransaction (function (err) {
                        if (err) {
                            console.error (`error in beginning transaction:` + err);
                            throw err;
                        } else {
                            node3.query (query, function (err, result) {
                                if (err) {
                                    node3.rollback (function () {
                                        console.error (`error in inserting: ` + err);
                                        throw err;
                                    });
                                } else {
                                    node3.commit (function (err) {
                                        if (err) {
                                            console.error (`error in committing:` + err);
                                            throw err;
                                        } else {
                                            return callback (result);
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
            } else {
                node1.query (query, function (err, result) {
                    if (err) {
                        node1.rollback (function () {
                            console.error (`error in insert: ` + err);

                            if (movies.year < 1980) {
                                node2.beginTransaction (function (err) {
                                    if (err) {
                                        console.error (`error in beginning transaction:` + err);
                                        throw err;
                                    } else {
                                        node2.query (query, function (err, result) {
                                            if (err) {
                                                node2.rollback (function () {
                                                    console.error (`error in inserting: ` + err);
                                                    throw err;
                                                });
                                            } else {
                                                node2.commit (function (err) {
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
                            } else {
                                node3.beginTransaction (function (err) {
                                    if (err) {
                                        console.error (`error in beginning transaction:` + err);
                                        throw err;
                                    } else {
                                        node3.query (query, function (err, result) {
                                            if (err) {
                                                node2.rollback (function () {
                                                    console.error (`error in update: ` + err);
                                                    throw err;
                                                });
                                            } else {
                                                node3.commit (function (err) {
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
                            }
                        });
                    } else {
                        node1.commit (function (err) {
                            if (err) {
                                if (movies.year < 1980) {
                                    node2.beginTransaction (function (err) {
                                        if (err) {
                                            console.error (`error in beginning transaction:` + err);
                                            throw err;
                                        } else {
                                            node2.query (query, function (err, result) {
                                                if (err) {
                                                    node2.rollback (function () {
                                                        console.error (`error in update: ` + err);
                                                        throw err;
                                                    });
                                                } else {
                                                    node2.commit (function (err) {
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
                                } else {
                                    node3.beginTransaction (function (err) {
                                        if (err) {
                                            console.error (`error in beginning transaction:` + err);
                                            throw err;
                                        } else {
                                            node3.query (query, function (err, result) {
                                                if (err) {
                                                    node2.rollback (function () {
                                                        console.error (`error in update: ` + err);
                                                        throw err;
                                                    });
                                                } else {
                                                    node3.commit (function (err) {
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
                                }
                            } else {
                                console.log (`data was committed/inserted to node1\n.`);
                                return callback (result);
                            }
                        });
                    }
                });
            }
        });
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

        node1.beginTransaction (function (err) {
            if (err) {
                if (year < 1980) {
                    node2.beginTransaction (function (err) {
                        if (err) {
                            console.error (`error in beginning transaction:` + err);
                            throw err;
                        } else {
                            node2.query (query, function (err, result) {
                                if (err) {
                                    node2.rollback (function () {
                                        console.error (`error in update: ` + err);
                                        throw err;
                                    });
                                } else {
                                    node2.commit (function (err) {
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
                } else {
                    node3.beginTransaction (function (err) {
                        if (err) {
                            console.error (`error in beginning transaction:` + err);
                            throw err;
                        } else {
                            node3.query (query, function (err, result) {
                                if (err) {
                                    node3.rollback (function () {
                                        console.error (`error in update: ` + err);
                                        throw err;
                                    });
                                } else {
                                    node3.commit (function (err) {
                                        if (err) {
                                            console.error (`error in committing:` + err);
                                            throw err;
                                        } else {
                                            return callback (result);
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
            } else {
                node1.query (query, function (err, result) {
                    if (err) {
                        node1.rollback (function () {
                            console.error (`error in insert: ` + err);

                            if (year < 1980) {
                                node2.beginTransaction (function (err) {
                                    if (err) {
                                        console.error (`error in beginning transaction:` + err);
                                        throw err;
                                    } else {
                                        node2.query (query, function (err, result) {
                                            if (err) {
                                                node2.rollback (function () {
                                                    console.error (`error in update: ` + err);
                                                    throw err;
                                                });
                                            } else {
                                                node2.commit (function (err) {
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
                            } else {
                                node3.beginTransaction (function (err) {
                                    if (err) {
                                        console.error (`error in beginning transaction:` + err);
                                        throw err;
                                    } else {
                                        node3.query (query, function (err, result) {
                                            if (err) {
                                                node2.rollback (function () {
                                                    console.error (`error in update: ` + err);
                                                    throw err;
                                                });
                                            } else {
                                                node3.commit (function (err) {
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
                            }
                        });
                    } else {
                        node1.commit (function (err) {
                            if (err) {
                                if (year < 1980) {
                                    node2.beginTransaction (function (err) {
                                        if (err) {
                                            console.error (`error in beginning transaction:` + err);
                                            throw err;
                                        } else {
                                            node2.query (query, function (err, result) {
                                                if (err) {
                                                    node2.rollback (function () {
                                                        console.error (`error in update: ` + err);
                                                        throw err;
                                                    });
                                                } else {
                                                    node2.commit (function (err) {
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
                                } else {
                                    node3.beginTransaction (function (err) {
                                        if (err) {
                                            console.error (`error in beginning transaction:` + err);
                                            throw err;
                                        } else {
                                            node3.query (query, function (err, result) {
                                                if (err) {
                                                    node2.rollback (function () {
                                                        console.error (`error in update: ` + err);
                                                        throw err;
                                                    });
                                                } else {
                                                    node3.commit (function (err) {
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
                                }
                            } else {
                                console.log (`data was committed/inserted to node1\n.`);
                                return callback (result);
                            }
                        });
                    }
                });
            }
        });
    },

    delete: function (id, year, callback) {
        var query = `DELETE FROM movies WHERE id = ` + id + `;`;

        node1.beginTransaction (function (err) {
            if (err) {
                if (year < 1980) {
                    node2.beginTransaction (function (err) {
                        if (err) {
                            console.error (`error in beginning transaction:` + err);
                            throw err;
                        } else {
                            node2.query (query, function (err, result) {
                                if (err) {
                                    node2.rollback (function () {
                                        console.error (`error in deleting: ` + err);
                                        throw err;
                                    });
                                } else {
                                    node2.commit (function (err) {
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
                } else {
                    node3.beginTransaction (function (err) {
                        if (err) {
                            console.error (`error in beginning transaction:` + err);
                            throw err;
                        } else {
                            node3.query (query, function (err, result) {
                                if (err) {
                                    node3.rollback (function () {
                                        console.error (`error in deleting: ` + err);
                                        throw err;
                                    });
                                } else {
                                    node3.commit (function (err) {
                                        if (err) {
                                            console.error (`error in committing:` + err);
                                            throw err;
                                        } else {
                                            return callback (result);
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
            } else {
                node1.query (query, function (err, result) {
                    if (err) {
                        node1.rollback (function () {
                            console.error (`error in insert: ` + err);

                            if (year < 1980) {
                                node2.beginTransaction (function (err) {
                                    if (err) {
                                        console.error (`error in beginning transaction:` + err);
                                        throw err;
                                    } else {
                                        node2.query (query, function (err, result) {
                                            if (err) {
                                                node2.rollback (function () {
                                                    console.error (`error in deleting: ` + err);
                                                    throw err;
                                                });
                                            } else {
                                                node2.commit (function (err) {
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
                            } else {
                                node3.beginTransaction (function (err) {
                                    if (err) {
                                        console.error (`error in beginning transaction:` + err);
                                        throw err;
                                    } else {
                                        node3.query (query, function (err, result) {
                                            if (err) {
                                                node2.rollback (function () {
                                                    console.error (`error in deleting: ` + err);
                                                    throw err;
                                                });
                                            } else {
                                                node3.commit (function (err) {
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
                            }
                        });
                    } else {
                        node1.commit (function (err) {
                            if (err) {
                                if (year < 1980) {
                                    node2.beginTransaction (function (err) {
                                        if (err) {
                                            console.error (`error in beginning transaction:` + err);
                                            throw err;
                                        } else {
                                            node2.query (query, function (err, result) {
                                                if (err) {
                                                    node2.rollback (function () {
                                                        console.error (`error in update: ` + err);
                                                        throw err;
                                                    });
                                                } else {
                                                    node2.commit (function (err) {
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
                                } else {
                                    node3.beginTransaction (function (err) {
                                        if (err) {
                                            console.error (`error in beginning transaction:` + err);
                                            throw err;
                                        } else {
                                            node3.query (query, function (err, result) {
                                                if (err) {
                                                    node2.rollback (function () {
                                                        console.error (`error in update: ` + err);
                                                        throw err;
                                                    });
                                                } else {
                                                    node3.commit (function (err) {
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
                                }
                            } else {
                                console.log (`data was committed/inserted to node1\n.`);
                                return callback (result);
                            }
                        });
                    }
                });
            }
        })
    },

    select: function (select, where, callback) {
        var query = `SELECT `;

        for (var i = 0; i < select.length; i++) {
            if (i != 0 && select[i].split(" "). join("") != `rank`) {
                query = query + `, ` + select [i];
            } else if (i != 0) {
                query = query + `, \`` + select [i] + `\``;
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

        var result = [];
        if (node2_checker && node3_checker) {
            node2.query(query, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    result.push(res);

                    node3.query (query, function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            result.push(res);
                            callback(result);
                        }
                    });
                }
            });
        } else if (node1_checker) {
            node1.query(query, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    callback(res);
                }
            });
        } else {
            var err = `All nodes are inaccessible.`

            throw err;
        }

    },

    selectAllMovies: function (callback) {
        var query = `SELECT * from movies;`;

        var result = [];
        if (node2_checker && node3_checker) {
            node2.query(query, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    result.push(res);

                    node3.query (query, function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            result.push(res);
                            callback(result);
                        }
                    });
                }
            });
        } else if (node1_checker) {
            node1.query(query, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    callback(res);
                }
            });
        } else {
            var err = `All nodes are inaccessible.`

            throw err;
        }
    }
};

module.exports = nodes_funcs;