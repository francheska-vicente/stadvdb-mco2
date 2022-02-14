const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config(); 

var path = require('path');
var fs = require('fs'); // for reading of certificate for connection
const serverCa = [fs.readFileSync(path.resolve("models/DigiCertGlobalRootCA.crt.pem"))]; // certificate provided by AZURE Database

const node1 = mysql.createPool({
    host: process.env.HOSTNAME1,
    port: process.env.PORT1,
    user: process.env.USERNAME1,
    password: process.env.PASSWORD1,
    database: process.env.NAME1,
    connectTimeout: 5000,
    waitForConnections: true,
    connectionLimit: 101,
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
    waitForConnections: true,
    connectionLimit: 101,
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
    waitForConnections: true,
    connectionLimit: 101,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
});

const nodes_funcs = {
    // starting a connection with the nodes
    connect_node: async function (node) {
        switch (node) {
            case 1: return await node1.getConnection();
            case 2: return await node2.getConnection();
            case 3: return await node3.getConnection();
        }
    },

    ping_node: async function (node) {
        switch (node) {
            case 1: 
                try { 
                    let val = await node1.query('SELECT 1 + 1 AS solution'); 
                    return val[0][0].solution;
                }
                catch (error) { console.log(error); }
                break;

            case 2: 
                try {
                    let val = await node2.query('SELECT 1 + 1 AS solution');
                    return val[0][0].solution;
                }
                catch (error) { console.log(error); }
                break;

            case 3: 
                try {
                    let val = await node3.query('SELECT 1 + 1 AS solution');
                    return val[0][0].solution;
                }
                catch (error) { console.log(error); }
                break;
        }
    },

    query_node: async function (node, query) {
        switch (node) {
            case 1: return await node1.query(query);
            case 2: return await node2.query(query);
            case 3: return await node3.query(query);
        }
    }
};

module.exports = nodes_funcs;