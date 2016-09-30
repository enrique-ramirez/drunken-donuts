var app = angular.module('admin', []);

var socket = io.connect(location.host);
socket.on('connect', function() {
  console.log('Connected...');
});

app.controller('ChatController', ['$scope', function($scope) {
  $scope.activeChat = null;
  $scope.user = {
    name: 'Gilberto Avalos'
  };

  $scope.chats = [];

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

    user.offline = true;

    if (!$scope.$$phase) {
      $scope.$apply();
    }
  });

  socket.on('message', function(data) {
    var chat = _.find($scope.chats, function(chat) {
      return chat.clientId === data.clientId;
    });

    if (chat) {
      chat.messages = chat.messages || [];
      chat.messages.push(data);
    }

    if (!$scope.$$phase) {
      $scope.$apply();
    }

    var chatWindow = document.querySelector('.chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
}]);
