var PORT = process.env.PORT || 3000
var express = require('express');
var db = require('./db.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientsInfo = {};
var usernames = [];


io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});

	socket.on('disconnect', function() {
		var userData= clientsInfo[socket.id];
		if (typeof userData !== 'undefined') {
			socket.disconnect();

			io.emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});

			delete clientsInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {

		clientsInfo[socket.id] = req;
		usernames.push(req.name);

		var historyMessage = {'messageArray': []};
		db.message.findAll({where: {}}).then(function (messages) {
			
			messages.forEach(function (eachMessage){
				console.log(eachMessage.toJSON());
				historyMessage.messageArray.push(eachMessage);				
			});

			socket.emit('historyMessage', historyMessage);
		}, function (e) {
			console.log(e);
		});
		
		socket.broadcast.emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});

	});

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);

		if(message.text === '@currentUsers') {
			socket.emit('message', {
				name: 'System',
				text: 'Current users: ' + usernames.join(', '),
				timestamp: moment().valueOf()
			});
		} else {
			var now = moment().valueOf();
			message.timestamp = now; // returns JavaScript timestamp
			socket.broadcast.emit('message', message);
			socket.emit('message', {
				name: 'Me',
				text: message.text,
				timestamp: now
			});

			//store messages into database
			db.message.create({
				username: message.name,
				timestamp:now.toString(),
				content: message.text
			}).then(function (message) {
				console.log(message.toJSON());
			}, function (e) {
				console.log(e);
			});

		}		
	});	
});

db.sequelize.sync({force:true}).then(function () {
	http.listen(PORT, function () {
		console.log('Server started!');
	});
});

