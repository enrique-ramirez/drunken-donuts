var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  socket.emit('hi', { hello: 'world' });

  socket.on('hi', function (data) {
    console.log(data);
  });
});

server.listen(process.env.PORT || 3000);
