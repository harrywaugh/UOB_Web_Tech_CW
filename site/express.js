const express = require('express')
const app = express()
const bodyParser = require("body-parser");
// const sqlite3 = require('sqlite3').verbose();
const port = 8080

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug')
app.set('views', './views')

app.listen(port, () => console.log(`Server started, running on ${port}.`))

app.get('/',         function (req, res) { res.render('pages/home', { welcome_name: 'there' }) })
app.get('/login',    function (req, res) { res.render('pages/login') })
app.get('/forum',    function (req, res) { res.render('pages/forum') })
app.get('/tutorial', function (req, res) { res.render('pages/tutorial') })

app.post('/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log("\nUser logged in with the following credentials\nUsername = " + username + "\nPassword = " + password);
  res.render('pages/home', { title: 'Home Page', welcome_name: username })
})

// // open database in memory
// let db = new sqlite3.Database('./db/users.db', (err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the in-memory SQlite database.');
// });

// // close the database connection
// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });
