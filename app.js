var express = require('express');
var app = express();
var server = require('http').Server(app);
var session = require('express-session');
var bodyParser = require('body-parser');
var _ = require('underscore');
var io = require('socket.io')(server);

// Static content
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var expressSession = session({
  secret: '9s8a7dfyN(O&SF',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
});
app.use(expressSession);

io.use(function(socket, next) {
  expressSession(socket.request, socket.request.res, next);
});

app.get('/admin*', function(req, res) {
  req.session.user = {
    id: new Date().getTime(),
    first_name: 'Gilberto',
    role: 'support'
  };

  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/chat*', function(req, res) {
  res.sendFile(__dirname + '/public/chat.html');
});

// var chats = [];
var supportUsers = [];
io.on('connection', function (socket) {
  // io.emit('updateChats', chats);

  socket.on('message', function(data) {
    data.date = new Date();
    io.emit('message', data);
  });

  socket.on('clientConnected', function(data) {
    if (socket.request.session.user && socket.request.session.user.role === 'support') {
      supportUsers.push({
        clientId: socket.id
      });
    }

    if (data.user.role === 'user') {
      socket.request.session.user = data;
    }

    data = data || {};

    data.clientId = socket.id;
    io.emit('clientConnected', data);

    // chats.push(data);
  });

  socket.on('disconnect', function() {
    io.emit('clientDisconnected', socket.id);

    // chats = _.filter(function(chat) {
    //   return chat.clientId !== socket.id;
    // });
  });
});

server.listen(process.env.PORT || 3000);
