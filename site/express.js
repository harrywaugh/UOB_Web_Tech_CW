const express = require('express')
const app = express()
var bodyParser = require("body-parser");
const port = 8080

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug')
app.set('views', './views')

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', function (req, res) {
  res.render('pages/home', { title: 'Home Page', welcome_name: '' })
})

app.get('/login', function (req, res) {
  res.render('pages/login', { title: 'Login Page' })
})

app.post('/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username)
  console.log(password)
  res.render('pages/home', { title: 'Home Page', welcome_name: username })
})
