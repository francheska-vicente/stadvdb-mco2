const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config(); 

var path = require('path');
const { NULL } = require('mysql/lib/protocol/constants/types');
var fs = require('fs'); // for reading of certificate for connection
const serverCa = [fs.readFileSync(path.resolve("models/DigiCertGlobalRootCA.crt.pem"))]; // certificate provided by AZURE Database

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
    connect_node: async function (node) {
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

    execute_query: async function (conn, query) {
        return await conn.query(query);
    }
};

module.exports = nodes_funcs;