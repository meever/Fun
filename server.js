// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var port     = process.env.PORT || 3001;
var mongoose = require('mongoose');
var passport = require('passport');
var session  = require('express-session')
var flash    = require('connect-flash');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport);

//app.configure(function() {
	// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//Routing
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'hereisafunsite' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
http.listen(port);
console.log('The magic happens on port ' + port);


var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  })
})


