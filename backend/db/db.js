var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'drag01n1',
  database: 'settle-ours'
});

connection.connect()

module.exports = connection;