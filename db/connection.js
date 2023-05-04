const mysql = require('mysql');

require('dotenv').config();

const connect = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.SQLPASSWORD,
    databade: 'company_db'
});

module.exports = connect;