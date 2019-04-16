"use strict";

/////////////////////////////////
// Node Configuration
/////////////////////////////////
const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const port = 8080
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug')
app.set('views', './views')


/////////////////////////////////
// Set server to listen on port
/////////////////////////////////
app.listen(port, () => console.log(`Server started, running on ${port}.`))


/////////////////////////////////
// Map GET requests
/////////////////////////////////
app.get('/',         function (req, res) { res.render('pages/home', { welcome_name: 'there' }) })
app.get('/login',    function (req, res) { res.render('pages/login') })
app.get('/forum',    function (req, res) { res.render('pages/forum') })
app.get('/tutorial', function (req, res) { res.render('pages/tutorial') })
app.get('/new_user', function (req, res) { res.render('pages/new_user') })


/////////////////////////////////
// Map POST requests
/////////////////////////////////
app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  check_login(username, password, req, res);
})
app.post('/new_user', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  create_user(username, password, password2, req, res);
})

/////////////////////////////////
// Open database connection
/////////////////////////////////
let db = new sqlite3.Database('./db/users.db', (err) => {
  if (err) {
    console.log('Error: Opening Database\n');
    return console.error(err.message);
  }
  console.log('Connection opened to database.');
  db.exec(db_schema);
  insert("hw16471", "pass");
});


/////////////////////////////////
// Database queries
/////////////////////////////////
const db_schema = "CREATE TABLE IF NOT EXISTS Accounts ('username', 'password');"
let insert = function(username, password){
  db.exec("INSERT INTO Accounts (username, password) VALUES ('"+username+"', '"+password+"');");
}

function check_login(username, password, req, res){
  db.all("select * from Accounts;" , (err, rows) => {
  if (err) throw err; 
  for (var i = 0; i < rows.length; i++) {
    if (rows[i]['username'] === username && rows[i]['password'] === password)  {
      console.log("\nUser logged in with the following credentials\nUsername = " + username);
      console.log("Password = " + password);
      res.render('pages/home', { welcome_name: username })
      return;
    }
  }
  res.render('pages/login', { error_msg: "Invalid Login Details" })
  });
}

function create_user(username, password, password2, req, res){
  if (password === password2)  {
    console.log("\nUser created an account with the following credentials\nUsername = " + username);
    console.log("Password = " + password);
    console.log("Password2 = " + password2);
    insert(username, password);

    res.render('pages/home', { welcome_name: username })
  } else {
    res.render('pages/new_user', { error_msg: "Passwords dont match" })
  }
}
