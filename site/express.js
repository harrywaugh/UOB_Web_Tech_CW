const express = require('express')
const app = express()
const port = 8080

app.set('view engine', 'pug')
app.set('views', './views')

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', function (req, res) {
  res.render('home', { title: 'Home Page', message: 'Hello there, this is the home page!' })
})

app.get('/login', function (req, res) {
  res.render('login', { title: 'Login Page' })
})

app.post('/', function (req, res) {
  response = {
    username:req.body.username,
    password:req.body.password
  };
  console.log(response)
})
