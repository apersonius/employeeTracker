const mysql = require('mysql2');

const connect = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.SQLPASSWORD,
    databade: 'company_db'
});

module.exports = connect;