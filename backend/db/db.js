var mysql = require('mysql')

//set up your own db cconfig
var connection = mysql.createConnection({

});
connection.connect()

module.exports = connection;