var app = angular.module('admin', []);

var socket = io.connect(location.host);
socket.on('connect', function() {
  console.log('Connected...');
});

app.controller('ChatController', ['$scope', '$http', function($scope, $http) {
  $scope.activeChat = null;
  $scope.chats = [];
  $scope.user = {
    first_name: 'Gilberto'
  };

  socket.emit('login', $scope.user);

  socket.on('updateChats', function(chats) {
    $scope.chats = chats;
  });

  $scope.setActiveChat = function(chat) {
    $scope.activeChat = chat;
  };

  $scope.sendMessage = function() {
    socket.emit('message', {
      clientId: $scope.activeChat.clientId,
      message: $scope.message,
      from: $scope.user
    });
    $scope.message = '';
  };

  socket.on('clientConnected', function(data) {
    var chat = _.find($scope.chats, function(chat) {
      return chat.clientId === data.clientId;
    });

    if (!chat) {
      $scope.chats.push(data);
    }

    if (!$scope.$$phase) {
      $scope.$apply();
    }
  });

  socket.on('clientDisconnected', function(clientId) {
    var user = _.find($scope.chats, function(chat) {
      return clientId === chat.clientId;
    });

    if (user) {
      user.offline = true;
    }

    if (!$scope.$$phase) {
      $scope.$apply();
    }
  });

  socket.on('message', function(data) {
    var chat = _.find($scope.chats, function(chat) {
      return chat.clientId === data.clientId || chat.user.id === data.id;
    });

    if (chat) {
      chat.messages = chat.messages || [];

      if (data.clientId === socket.id) {
        data.fromMe = true;
      }

      chat.messages.push(data);
    }

    if (!$scope.$$phase) {
      $scope.$apply();
    }

    var chatWindow = document.querySelector('.chat-container');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
}]);
