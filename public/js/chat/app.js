jQuery(document).ready(function() {

    // Move to bottom scroll
    var messages = document.getElementById('chat_body');
    messages.scrollTop = messages.scrollHeight;

    if (window.addEventListener) {
        window.addEventListener('message', listenMessage, false);
    } else {
        window.attachEvent('onmessage', listenMessage);
    }

    function listenMessage(data) {
        alert('TE ESCUCHO!');
    }
});