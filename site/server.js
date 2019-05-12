"use strict";

/////////////////////////////////
// Constant Initialisation
/////////////////////////////////
const express    = require('express')
const session    = require('express-session');
const uuid       = require('uuid/v4')
const bodyParser = require("body-parser");
const sqlite3    = require('sqlite3').verbose();
const bcrypt     = require('bcrypt');
var path         = require('path');
const app        = express()
const port       = 8080
const avatar_n   = 27


/////////////////////////////////
// Node Configuration
/////////////////////////////////
app.use(session({ genid: (req) => {return uuid() }, 
  secret: 'shhhh', 
  resave: false,
  saveUninitialized: true,
  expires: new Date(Date.now() + (30 * 60 * 1000)) //Check this! Sessions should expire after 30 minutes
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static(path.join(__dirname, "public")));


/////////////////////////////////
// Set server to listen on port
/////////////////////////////////
app.listen(port, 'localhost', () => console.log(`Server started, running on ${port}.`))


/////////////////////////////////
// Map GET requests
/////////////////////////////////
app.get('/',         function (req, res) { existing_session('pages/home',     req, res, {}); })
app.get('/error',    function (req, res) { existing_session('pages/error',    req, res, {}); })
app.get('/login',    function (req, res) { res.render('pages/login');                        })
app.get('/forum',    function (req, res) { render_forum('pages/forum',        req, res);     })
app.get('/tutorial', function (req, res) { existing_session('pages/tutorial', req, res, {}); })
app.get('/new_user', function (req, res) { res.render('pages/new_user');                     })
app.get('*',         function (req, res) { existing_session('pages/error',    req, res, {}); }) 

/////////////////////////////////
// Map POST requests
/////////////////////////////////
app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  check_login(username, password, req, res);
})
app.post('/logout', function (req, res) {
  logout(req, res);
})
app.post('/new_user', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  create_user(username, password, password2, req, res);
})
app.post('/create_post', function (req, res) {
  var post = req.body.post;
  insert_post(post, req, res);
})
app.post('/reply_to_post', function (req, res) {
  var reply = req.body.reply;
  var post_id = req.body.post_id;
  insert_reply(post_id, reply, req, res);
})

function errorHandler (err, req, res, next) {
  res.status(500)
  throw_error(err);
}


/////////////////////////////////
// Open database connection
/////////////////////////////////
let db = new sqlite3.Database('./db/users.db', (err) => {
  if (err) {
    console.log('Error: Opening Database\n');
    return console.error(err.message);
  }
  console.log('Connection opened to database.');
  db.exec(db_schema, () => {
    insert_user("hw16471", "pass", "NULL");
    insert_user("harry", "pass", "NULL");
    insert_user("fh16413", "pass", "NULL");
    insert_user("bob", "pass", "NULL");
    insert_user("ian", "pass", "NULL");
    insert_user("man", "pass", "NULL");
    insert_user("woman", "pass", "NULL");
    forum_insert_post.run(["hw16471's message", "hw16471"]);
    forum_insert_post.run(["harry's message", "harry"]);
    forum_insert_post.run(["finn's message", "finn"]);
    forum_insert_post.run(["harry's message", "hw16471"]);
    forum_insert_post.run(["fh16413's message", "fh16413"]);
    forum_insert_post.run(["bob's message", "bob"]);
    forum_insert_post.run(["man's message", "man"]);
    forum_insert_post.run(["woman's message", "woman"]);
    replies_insert_reply.run([2, "harry's reply", "harry"]);
    replies_insert_reply.run([2, "he's replied again", "harry"]);
    replies_insert_reply.run([3, "finn's replied to his own message", "finn"]);
    replies_insert_reply.run([3, "Bob's getting in on the action", "finn"]);
  });

});

/////////////////////////////////
// Database queries
/////////////////////////////////
const db_schema =  "DROP TABLE IF EXISTS Accounts; DROP TABLE IF EXISTS Forum; DROP TABLE IF EXISTS Replies;\
                    CREATE TABLE IF NOT EXISTS Accounts (username TEXT PRIMARY KEY,password TEXT,avatar_id INT,session TEXT);\
                    CREATE TABLE IF NOT EXISTS Forum (post_id INTEGER PRIMARY KEY AUTOINCREMENT,message TEXT,\
                    username TEXT, FOREIGN KEY (username) REFERENCES Accounts(username));\
                    CREATE TABLE IF NOT EXISTS Replies (reply_id INTEGER PRIMARY KEY AUTOINCREMENT,\
                    post_id INTEGER,message TEXT,username TEXT,\
                    FOREIGN KEY (post_id) REFERENCES Forum(post_id),\
                    FOREIGN KEY (username) REFERENCES Forum(username));"


const account_select_username = db.prepare("SELECT * FROM Accounts WHERE username=?");
const account_select_session  = db.prepare("SELECT * FROM Accounts WHERE session=?");
const account_insert          = db.prepare("REPLACE INTO Accounts (username,password,avatar_id,session) VALUES (?,?,?,?);");
const account_logout          = db.prepare("REPLACE INTO Accounts (username,password,avatar_id,session) VALUES (?,?,?,NULL);");
const forum_insert_post       = db.prepare("INSERT INTO Forum (post_id,message,username) VALUES (NULL,?,?);");
const forum_select            = db.prepare("SELECT * FROM Forum JOIN Accounts ON Forum.username=Accounts.username;");
const replies_insert_reply    = db.prepare("INSERT INTO Replies (reply_id,post_id,message,username) VALUES (NULL,?,?,?);");
const replies_select          = db.prepare("SELECT * FROM Replies JOIN Accounts ON Replies.username=Accounts.username;");

function create_user(username, password, password2, req, res){ 
  if (password === password2)  {
    insert_user(username, password, req.sessionID);
    res.render('pages/home', { welcome_name: username, logged_in: true  });
  } else {
    res.render('pages/new_user', { error_msg: "Passwords dont match" })
  }
}

function insert_user(username, password, sessionID){
  account_select_username.all([username] , (err, rows) => {
    if (err) throw_error(err);
    if(rows.length == 0)
      bcrypt.hash(password, 10, function(err, hash) {
        account_insert.run([username, hash,Math.floor(Math.random() * avatar_n),sessionID]);
      });
  });
}

function insert_post(message, req, res){
  account_select_session.get([req.sessionID], (err, row) => {
    if (err) throw_error(err);
    forum_insert_post.run([message, row['username']], () => {
      render_forum('pages/forum', req, res);
    });
  });
}

function insert_reply(post_id, reply, req, res){
  account_select_session.get([req.sessionID], (err, row) => {
    if (err) throw_error(err);
    replies_insert_reply.run([post_id, reply, row['username']], () => {
      render_forum('pages/forum', req, res);
    });
  });
}

function check_login(username, password, req, res){
  account_select_username.each([username] , (err, row) => {
    if (err) throw_error(err);
    if (bcrypt.compareSync(password, row['password']))  {
      account_insert.run(row['username'],row['password'],Math.floor(Math.random() * avatar_n),req.sessionID);
      res.render('pages/home', { welcome_name: username, logged_in: true  });
      return;
    }
    res.render('pages/login', { error_msg: "Invalid Login Details" })
  });
}

function existing_session(view, req, res, args){
  account_select_session.all([req.sessionID] , (err, rows) => {
    if (err) throw_error(err);
    if(rows.length == 0)
      res.render(view, Object.assign({}, { welcome_name: 'there' }, args));
    else
      res.render(view, Object.assign({}, { welcome_name: rows[0]['username'], avatar:get_avatar_file(rows[0]['avatar_id']), logged_in: true}, args));
  });
}

function render_forum(view, req, res)  {
  forum_select.all( (err, rows) => {
    if (err) throw_error(err);
    var forum_list=[];
    for (var r=0; r < rows.length; r++)  {
      var avatar_file = "media/avatar" + rows[r]['avatar_id'].toString() +".png";
      var post = { post_id:    rows[r]['post_id'].toString(),
                   avatar_img: avatar_file,
                   username:   rows[r]['username'],
                   message:    rows[r]['message'], replies: [] };
      forum_list.push(post);
    }
    replies_select.all( (err, rows) => {
      for (var r=0; r < rows.length; r++)  {
        var avatar_file = get_avatar_file(rows[r]['avatar_id']);
        var reply = { avatar_img: avatar_file, username: rows[r]['username'], reply: rows[r]['message']};
        forum_list[rows[r]['post_id']-1].replies.push(reply);
      }
      existing_session(view, req, res, { posts : forum_list.reverse()});
    });

  });
}

function logout(req, res)  {
  account_select_session.get([req.sessionID] , (err, row) => {
    if (err) throw_error(err, req, res);
    account_logout.run(row['username'],row['password'],Math.floor(Math.random() * avatar_n));
    res.render('pages/home', { welcome_name: 'there'});
  });
} 

function throw_error(err, req, res)  {
  console.log(err);
  existing_session('pages/error', req, res, {});
}

function get_avatar_file(id)  {
  return "media/avatar" + id.toString() +".png";
}