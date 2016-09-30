jQuery(document).ready(function() {
    var socket = window.socket = io.connect(location.host);
    socket.on('connect', function() {
        console.log('Connected...');
    });

    socket.on('message', function(data) {
        if (data.role === 'user') {
            selfMessage(data.message);
        } else {
            otherMessage(data.message);
        }
    });

    if (window.addEventListener) {
        window.addEventListener('message', initData, false);
    } else {
        window.attachEvent('onmessage', initData);
    }

    function initData(event) {
        window.userData = event.data;

        socket.emit('clientConnected', event.data);
    }

    $('form').on('submit', function(event) {
        var $input = $('#btn-input'),
            message = $input.val();

        if (!message) {return;}

        socket.emit('message', {
            message: message,
            role: 'user',
            id: window.userData.user.id
        });

        $input.val('');

        event.preventDefault();
    });

    function scrollToBottom() {
        var messages = document.getElementById('chat_body');
        messages.scrollTop = messages.scrollHeight;
    }

    function selfMessage(message) {
        var html = '';
        var $messages = jQuery('#chat_body');

        html+= '<div class="row msg_container base_sent">';
        html+= '<div class="col-md-10 col-xs-10">';
        html+= '<div class="messages msg_sent">';
        html+= '<p>' + message + '</p>';
        html+= '</div>';
        html+= '</div>';
        html+= '<div class="col-md-2 col-xs-2 avatar">';
        html+= '<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">';
        html+= '</div>';
        html+= '</div>';

        $messages.append(html);
        scrollToBottom();
    }

    function otherMessage(message) {
        var html = '';
        var $messages = jQuery('#chat_body');

        html+= '<div class="row msg_container base_receive">';
        html+= '<div class="col-md-2 col-xs-2 avatar">';
        html+= '<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">';
        html+= '</div>';
        html+= '<div class="col-md-10 col-xs-10">';
        html+= '<div class="messages msg_receive">';
        html+= '<p>' + message + '</p>';
        html+= '<time datetime="2009-11-13T20:00">Timothy • 51 min</time>';
        html+= '</div>';
        html+= '</div>';
        html+= '</div>';

        $messages.append(html);
        scrollToBottom();
    }
});