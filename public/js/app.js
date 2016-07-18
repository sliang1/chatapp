var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

jQuery('.room-title').text(room);

socket.on('connect', function() {
	console.log('Connected to socket.io server');
	socket.emit('joinRoom', {
		name: name,
		room: room
	})

});

socket.on('message', function(message){
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');

	console.log('New message: ');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' +momentTimestamp.local().format ('MMM Do YYYY, h:mm a') + '</p></strong>');

	$message.append('<p>'+ message.text + '</p>');

});

//handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	if ($message.val().length >0 ) {

		socket.emit('message', {
			name: name,
			text: $message.val()
		});
	} else {
		alert("The content couldn't be empty!");
	}

	$message.val('');


});