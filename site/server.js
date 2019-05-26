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
const pug = require('pug');
const path       = require('path');
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

app.use("/jquery", express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use("/media",  express.static(path.join(__dirname, "/views/media")));
app.use("/js",     express.static(path.join(__dirname, "/views/js")));
app.use("/css",    express.static(path.join(__dirname, "/views/css")));
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
app.post('/', function (req, res) {
  var username  = req.body.username;
  var password  = req.body.password;
  var password2 = req.body.password2;
  create_user(username, password, password2, req, res);
})
app.post('/create_post', function (req, res) {
  var post_title = req.body.post_title_box;
  var post_msg = req.body.post_msg_box;
  insert_post(post_title, post_msg, req, res);
})
app.post('/reply_to_post', function (req, res) {
  var reply = req.body.reply;
  var post_id = req.body.post_id;
  insert_reply(post_id, reply, req, res);
})
app.post('/get_replies', function (req, res) {
  var post_id = req.body.post_id;
  get_replies(post_id, req, res);
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
  db.exec(db_schema, () => {
    insert_user("hw16471", "pass", "NULL");
    insert_user("Harry", "pass", "NULL");
    insert_user("Finn", "pass", "NULL");
    insert_user("KhaosFan123", "pass", "NULL");
    insert_user("Ian", "pass", "NULL");
    var now = new Date();


    let hash = bcrypt.hashSync('pass', 10);
    account_insert.run(["KhaosKitchen", hash,100,"NULL"]);


    forum_insert_post.run(["Release Date??", "When can I play Khaos Kitchen?? Very excited for it to come out!", "Finn", now.getTime() - 300*60*60*1000]);
    forum_insert_post.run(["Successful Launch at Games Day!", "Khaos Kitchen is officially released! Thank you to everyone who came to the launch at Games Day! Download Khaos Kitchen now from the appstore!", "KhaosKitchen", now.getTime() - 200*60*60*1000]);
    forum_insert_post.run(["New shop items???", "Will there be new costumes for my chef soon??", "KhaosFan123", now.getTime() - 100*60*60*1000]);
    forum_insert_post.run(["Windows phone support?", "Would love to play this game on my windows phone. Any chance of windows phone support soon?", "Harry", now.getTime() - 20*60*60*1000]);
    forum_insert_post.run(["New Update: Khaos Kitchen v1.1", "Whats new?\n\nBug Fixes.\nNew Skins! A range of new costumes for your chef available in the Top Chef Shop! Download the update now from the appstore.", "KhaosKitchen", now.getTime() - 30*60*1000]);

    replies_insert_reply.run([1, "Hi Finn!\n\nKhaos Kitchen is being released on May 14th! Come along to the launch at Merchant Venturer's Buillding!", "KhaosKitchen", now.getTime() - 295*60*60*1000]);
    replies_insert_reply.run([2, "Had great fun playing Khaos Kitchen! Love your game!", "Ian", now.getTime() - 195*60*60*1000]);
    replies_insert_reply.run([3, "We're working on a range of new skins for your chefs! They will be released very soon...", "KhaosKitchen", now.getTime()]);
    replies_insert_reply.run([4, "Sorry Harry, no one has a windows phone!", "KhaosKitchen", now.getTime()]);
  });
});

/////////////////////////////////
// Database
/////////////////////////////////
const db_schema =  "DROP TABLE IF EXISTS Accounts; DROP TABLE IF EXISTS Forum; DROP TABLE IF EXISTS Replies;\
                    CREATE TABLE IF NOT EXISTS Accounts (username TEXT PRIMARY KEY,password TEXT,avatar_id INT,session TEXT);\
                    CREATE TABLE IF NOT EXISTS Forum (post_id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,message TEXT,\
                    username TEXT, time BIGINT, FOREIGN KEY (username) REFERENCES Accounts(username));\
                    CREATE TABLE IF NOT EXISTS Replies (reply_id INTEGER PRIMARY KEY AUTOINCREMENT,\
                    post_id INTEGER,message TEXT,username TEXT,time BIGINT,\
                    FOREIGN KEY (post_id) REFERENCES Forum(post_id),\
                    FOREIGN KEY (username) REFERENCES Forum(username));"


const account_select_username = db.prepare("SELECT * FROM Accounts WHERE username=?");
const account_select_session  = db.prepare("SELECT * FROM Accounts WHERE session=?");
const account_insert          = db.prepare("REPLACE INTO Accounts (username,password,avatar_id,session) VALUES (?,?,?,?);");
const account_logout          = db.prepare("REPLACE INTO Accounts (username,password,avatar_id,session) VALUES (?,?,?,NULL);");
const forum_insert_post       = db.prepare("INSERT INTO Forum (post_id,title,message,username,time) VALUES (NULL,?,?,?,?);");
const forum_select            = db.prepare("SELECT * FROM Forum JOIN Accounts ON Forum.username=Accounts.username;");
const replies_insert_reply    = db.prepare("INSERT INTO Replies (reply_id,post_id,message,username,time) VALUES (NULL,?,?,?,?);");
const replies_select          = db.prepare("SELECT * FROM Replies JOIN Accounts ON Replies.username=Accounts.username;");
const replies_select_post     = db.prepare("SELECT * FROM Replies JOIN Accounts ON Replies.username=Accounts.username WHERE post_id=?;");



/////////////////////////////////
// Helper Functions
/////////////////////////////////
function create_user(username, password, password2, req, res){
  if (password === password2)  {
    account_select_username.all([username] , (err, rows) => {
      if (err) throw_error(err);
      if(rows.length == 0)
        bcrypt.hash(password, 10, function(err, hash) {
          account_insert.run([username, hash, Math.floor(Math.random() * avatar_n),req.sessionID]);
          // res.render('pages/home', { welcome_name: username, logged_in: true  });
          res.redirect('/');
        });
    });
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

function insert_post(post_title, post_msg, req, res){
  account_select_session.get([req.sessionID], (err, row) => {
    if (err) throw_error(err);
    var now = new Date();
    forum_insert_post.run([post_title, post_msg, row['username'], now.getTime()], () => {
      render_forum('pages/forum', req, res);
    });
  });
}

function insert_reply(post_id, reply_msg, req, res){
  account_select_session.get([req.sessionID], (err, row) => {
    if (err) throw_error(err);
    var now = new Date();
    replies_insert_reply.run([post_id, reply_msg, row['username'], now.getTime()]);
    var avatar_file = get_avatar_file(row['avatar_id']);
    var time_string = get_time_string(0);
    var reply = { avatar_img: avatar_file,
                    username:   row['username'],
                        time:   time_string,
                       reply:   reply_msg };
    var htmlRepliesString = pug.renderFile('views/pages/replies.pug', {replies: [reply]});
    res.send(JSON.stringify(htmlRepliesString));
    return;
  });
}

function check_login(username, password, req, res){
  account_select_username.each([username] , (err, row) => {
    if (err) throw_error(err);
    if (bcrypt.compareSync(password, row['password']))  {
      account_insert.run(row['username'],row['password'], row['avatar_id'],req.sessionID);
      res.send(true);
      // res.render('pages/home', { welcome_name: username, logged_in: true  });
      return;
    }
    res.send(false);
    return;
    // res.render('pages/login', { error_msg: "Invalid Login Details" })
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
    var now = new Date();

    for (var r=0; r < rows.length; r++)  {
      var avatar_file = "media/avatar" + rows[r]['avatar_id'].toString() +".png";
      var time_string = get_time_string(now.getTime() - rows[r]['time']);
      var post = { post_id:    rows[r]['post_id'].toString(),
                   avatar_img: avatar_file,
                   username:   rows[r]['username'],
                   time:       time_string,
                   title:      rows[r]['title'],
                   message:    rows[r]['message']};
      forum_list.push(post);
    }
    existing_session(view, req, res, { posts : forum_list.reverse()});
  });
}

function get_replies(post_id, req, res)  {
  replies_select_post.all([post_id], (err, rows) => {
    if (err) throw_error(err);
    var replies_list=[];
    var now = new Date();
    if (rows.length == 0)  {
      res.send(false);
      return;
    }

    for (var r=0; r < rows.length; r++)  {
      var avatar_file = get_avatar_file(rows[r]['avatar_id']);
      var time_string = get_time_string(now.getTime() - rows[r]['time']);
      var reply = { avatar_img: avatar_file,
                    username:   rows[r]['username'],
                    time:       time_string,
                    reply:      rows[r]['message'] };

      replies_list.push(reply);
    }
    var htmlRepliesString = pug.renderFile('views/pages/replies.pug', {replies: replies_list});
    res.send(JSON.stringify(htmlRepliesString));
    return;
  });
}

function logout(req, res)  {
  account_select_session.get([req.sessionID] , (err, row) => {
    if (err) throw_error(err, req, res);
    account_logout.run(row['username'],row['password'],row['avatar_id']);
    res.send(true);
    // res.render("pages/home",  Object.assign({}, { welcome_name: 'there', logged_in: false}));
  });
}

function throw_error(err, req, res)  {
  console.log(err);
  existing_session('pages/error', req, res, {});
}

function get_avatar_file(id)  {
  return "media/avatar" + id.toString() +".png";
}

function get_time_string(milliseconds)  {
  var seconds = milliseconds / 1000;
  if (seconds < 120) return "now";
  var minutes = seconds / 60;
  if (minutes < 60)  return Math.floor(minutes).toString() + " minutes ago";
  var hours = minutes / 60;
  if (hours < 24)    return Math.floor(hours).toString() + " hours ago";
  var days = hours / 24;
  if (days < 365)    return Math.floor(days).toString() + " days ago";
  return "A while ago";
}
