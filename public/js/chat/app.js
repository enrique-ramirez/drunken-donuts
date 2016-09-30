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

    // Move to bottom scroll
    var messages = document.getElementById('chat_body');
    messages.scrollTop = messages.scrollHeight;

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
    }

    initData({data: JSON.parse('{"user":{"id":"57ed819350af16c1c6000044","email":"enrique@wepow.com","first_name":"Enrique","last_name":"Ramírez","time_zone":"Guadalajara","language":"en","notification_settings":{"application_completed":"instant","candidate_messaged_recruiter":"instant","evaluation_completed":true,"comment_created":true,"candidate_direct_messaged_recruiter":true},"current_date":"2016-09-30T15:02:21.485"},"organization":{"id":"57ed817950af16c1c600001b","name":"WePow","subdomain":"dev","omniauth_providers":["facebook","gplus","linkedin"],"recruiters_can_request_phone_numbers":true,"created_at":"2016-09-29T16:02:49.658"}}')});
});