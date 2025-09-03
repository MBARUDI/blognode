var mysql = require("mysql");
var connectBanco = mysql.createConnection({
  host: "localhost", user: "root", password: "", 
  database: "blog"
});

module.exports = connectBanco;