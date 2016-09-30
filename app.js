var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/admin*', function(req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});

io.on('connection', function (socket) {
  socket.on('message', function(data) {
    if (io.sockets.connected[data.clientId]) {
      data.date = new Date();
      io.sockets.connected[data.clientId].emit('message', data);
    }
  });

  socket.on('clientConnected', function(data) {
    data = data || {};

    data.clientId = socket.id;
    io.emit('clientConnected', data);
  });

  socket.on('disconnect', function() {
    io.emit('clientDisconnected', socket.id);
  });
});

server.listen(process.env.PORT || 3000);
