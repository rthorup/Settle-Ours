var mysql = require('mysql')

//set up your own db cconfig
var connection = mysql.createConnection({
  host: 'settlers.cuzkxesofuo8.us-east-1.rds.amazonaws.com',
    user: 'rthorup',
    password: 'drag01n1',
    database: 'settle-ours'
  // host: 'localhost',
  // user: 'root',
  // password: 'drag01n1',
  // database: 'settle-ours'
});
connection.connect()

module.exports = connection;
