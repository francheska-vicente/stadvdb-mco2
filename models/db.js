process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const mysql = require('mysql2');
const dotenv = require('dotenv');
var fs = require('fs');

dotenv.config(); 

var nodeConnect;
var nodeNumber = process.env.NODE;
var path = require('path');
const serverCa = [fs.readFileSync(path.resolve("models/DigiCertGlobalRootCA.crt.pem"))];

switch (nodeNumber) 
{
    case '1':
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
            break;
    case '2':
        nodeConnect = mysql.createConnection({
            host: process.env.HOSTNAME2,
            port: process.env.PORT2,
            user: process.env.USERNAME2,
            password: process.env.PASSWORD2,
            database: process.env.NAME2
        });
            break;
    case '3':
        nodeConnect = mysql.createConnection({
            host: process.env.HOSTNAME3,
            port: process.env.PORT3,
            user: process.env.USERNAME3,
            password: process.env.PASSWORD3,
            database: process.env.NAME3
        });
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
        
        nodeConnect.query("SELECT * FROM movies", function (err, result, fields) {
            if (err) return console.log(err)
            console.log(result);
        });
    },

    insert: function () {

    },
};

module.exports = db_funcs;