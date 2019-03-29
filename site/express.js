const express = require('express')
const app = express()
const port = 8080

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
  response = {
    username:req.body.username,
    password:req.body.password
  };
  console.log(response)
})
