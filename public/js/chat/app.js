jQuery(document).ready(function() {
    var socket = io('/');

    // Move to bottom scroll
    var messages = document.getElementById('chat_body');
    messages.scrollTop = messages.scrollHeight;

    if (window.addEventListener) {
        window.addEventListener('message', initData, false);
    } else {
        window.attachEvent('onmessage', initData);
    }

    function initData(data) {
        alert(data.user.id);
        socket.emit('clientConnected', data);
    }
});