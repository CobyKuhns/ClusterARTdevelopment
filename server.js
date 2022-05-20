//express makes setting up your web server faster!
var express = require('express');

var app = express();
//This part links the public folder to the server, so ideally index.html will get pulled when someone connects
app.use(express.static('public'));
var server = app.listen(3000);



console.log("My socket server is running");

var socket = require('socket.io')

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	socket.on('mouse', mouseMsg);
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
		console.log(data);
	}
}