const mysql = require('mysql2');

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database:'codingtech_db',
    port : 3306
}

const connection = mysql.createConnection(config)

module.exports = connection.promise()