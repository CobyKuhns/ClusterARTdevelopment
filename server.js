//express makes setting up your web server faster!
var express = require('express');

var app = express();
//This part links the public folder to the server, so ideally index.html will get pulled when someone connects
app.use(express.static('public'));
var server = app.listen(3000);
var canvasState;


console.log("My socket server is running");

const io = require('socket.io')(server, {cors: {origin: "*"}});

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	if(typeof canvasState !== 'undefined') {
		socket.emit('update', canvasState);
	}
	else {
		socket.emit('update', "null");
	}
	socket.on('mouse', mouseMsg);
	socket.on('update', saveCanvas);
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
	}
	function saveCanvas(data) {
		canvasState = data;
	}
}