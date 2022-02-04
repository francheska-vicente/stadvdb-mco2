const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const NODE1 = {
    host: process.env.HOSTNAME1,
    port: process.env.PORT1,
    user: process.env.USERNAME1,
    password: process.env.PASSWORD1,
    database: process.env.NAME1
};

const NODE2 = {
    host: process.env.HOSTNAME2,
    port: process.env.PORT2,
    user: process.env.USERNAME2,
    password: process.env.PASSWORD2,
    database: process.env.NAME2
};

const NODE3 = {
    host: process.env.HOSTNAME3,
    port: process.env.PORT3,
    user: process.env.USERNAME3,
    password: process.env.PASSWORD3,
    database: process.env.NAME3
}

var nodeConnect;
var nodeNumber = process.env.NODE;

switch (nodeNumber) 
{
    case '1':
            break;
    case '2':
            break;
    case '3':
            break;
}

const db_funcs = {
    attri: {
        id: 'id',
        name: 'name', 
        year: 'year',
        rank: 'rank'
    },

    connect: function () {
        nodeConnect.connect();
    },

    insert: function () {

    },
};

module.exports = db_funcs;