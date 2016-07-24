var name = getQueryVariable('name');
//var room = getQueryVariable('room');
var socket = io();
var $message = jQuery('.messages');

var momentTimestamp;

console.log(name + ' wants to join!');

//jQuery('.room-title').text(room);

socket.on('connect', function() {
	console.log('Connected to socket.io server');
	socket.emit('joinRoom', {
		name: name
	})

});

socket.on('message', function(message){
	
	momentTimestamp = moment.utc(message.timestamp);

	console.log('New message: ');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' +momentTimestamp.local().format ('MMM Do YYYY, h:mm a') + '</p></strong>');

	$message.append('<p>'+ message.text + '</p>');

});

socket.on('historyMessage', function(messages){

	console.log(messages.messageArray.length);

	for(var i=0; i < messages.messageArray.length; i++) {
		momentTimestamp = moment.utc(Number(messages.messageArray[i].timestamp));

		$message.append('<p>' + messages.messageArray[i].username + ' ' +momentTimestamp.local().format ('MMM Do YYYY, h:mm a') + '</p>');

		$message.append('<p>'+ messages.messageArray[i].content + '</p>');
	}
	

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