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

io.use(function(socket, next) {
  expressSession(socket.request, socket.request.res, next);
});

app.get('/admin*', function(req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/chat*', function(req, res) {
  res.sendFile(__dirname + '/public/chat.html');
});

app.post('/login', function(req, res) {
  req.session.user = {
    username: req.body.username,
    role: 'support'
  };

  res.json({ success: true });
});

var chats = [];
io.on('connection', function (socket) {
  io.emit('updateChats', chats);

  socket.on('message', function(data) {
    if (io.sockets.connected[data.clientId]) {
      data.date = new Date();
      io.sockets.connected[data.clientId].emit('message', data);

      var chat = _.find(chats, function(chat) {
        return chat.clientId === chat.clientId;
      });

      if (chat) {
        chat.messages.push(data);
      }
    }
  });

  socket.on('clientConnected', function(data) {
    data = data || {};

    data.clientId = socket.id;
    io.emit('clientConnected', data);

    chats.push(data);
  });

  socket.on('disconnect', function() {
    io.emit('clientDisconnected', socket.id);

    chats = _.filter(function(chat) {
      return chat.clientId !== socket.id;
    });
  });
});

server.listen(process.env.PORT || 3000);
