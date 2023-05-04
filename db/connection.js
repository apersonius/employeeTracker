const mysql = require('mysql2');

require('dotenv').config();

const connect = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Dakota15!',
    database: 'company_db'
});

module.exports = connect;