// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const mysql = require('mysql2');
const dotenv = require('dotenv');
var fs = require('fs'); // for reading of certificate for connection

dotenv.config(); 

/* configuring the connection to the node */
var node1;
var node2;
var node3;

var nodeConnect;

var node1_checker = false;
var node2_checker = false;
var node3_checker = false;

var path = require('path');
const { NULL } = require('mysql/lib/protocol/constants/types');
const e = require('express');
// certificate provided by AZURE Database
const serverCa = [fs.readFileSync(path.resolve("models/DigiCertGlobalRootCA.crt.pem"))]; 



const db_funcs = {
    attri: {
        id: 'id',
        name: 'name', 
        year: 'year',
        rank: 'rank'
    },

    // starting a connection with the nodes
    connect: function (callback) {
        try {
            node1 = mysql.createConnection({
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
            
            node1.connect(function (err) {
                if (err) {
                    node1 = NULL;
                } else {
                    node1_checker = true;
                }
            });

        } catch (err) {
            node1 = NULL;
        }

        try {
            node2 = mysql.createConnection({
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

            node2.connect(function (err) {
                if (err) {
                    node2 = NULL;
                } else {
                    node2_checker = true;
                }
            });
        } catch (err) {
            node2 = NULL;
        }

        try {
            node3 = mysql.createConnection({
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

            node3.connect(function (err) {
                if (err) {
                    node3 = NULL;
                } else {
                    node3_checker = true;
                }
            });
        } catch (err) {
            node3 = NULL;
        }
        
        var myTimer = setInterval (function () {
            node1.ping((err)=> {
                if (err) {
                    node1_checker = false;
                } else {
                    node1_checker = true;
                }
            });

            node2.ping((err)=> {
                if (err) {
                    node2_checker = false;
                } else {
                    node2_checker = true;
                }
            });

            node3.ping((err)=> {
                if (err) {
                    node3_checker = false;
                } else {
                    node3_checker = true;
                }
            });
        }, 1000);

        // TODO: temporary; for testing! remove if for deployment
        setTimeout(function() {
            callback();
        }, 3000);
        
        /*
        nodeConnect.query("SELECT * FROM movies", function (err, result, fields) {
            if (err) return console.error(err)
            console.log(result);
        });
        */
    },

    // for executing a general query in MySQL
    execute_query: function (query, callback) {
        query = query.trim();

        var temp0 = query.split (" ")[0].toLowerCase();

        if (temp0 == 'insert' || temp0 == 'delete' || temp0 == 'select' || temp0 == 'update') {
            if (temp0 == 'select') {
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
            } else {
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
                                                console.error (`error in query: ` + err);
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
                                                console.error (`error in query: ` + err);
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
                                                            console.error (`error in query: ` + err);
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
                                                            console.error (`error in query: ` + err);
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
                                                                console.error (`error in query: ` + err);
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
                                                                console.error (`error in query: ` + err);
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
                                        console.log (`data was queried in node1\n.`);
                                        return callback (result);
                                    }
                                });
                            }
                        });
                    }
                })
            }
        } else {
            var error = `Unauthorized access of the database.`;
            throw error;
        }
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

module.exports = db_funcs;