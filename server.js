//express makes setting up your web server faster!
var express = require('express');
const { rawListeners } = require('process');

var app = express();
//This part links the public folder to the server, so ideally index.html will get pulled when someone connects
app.use(express.static('public'));
var server = app.listen(3000);
var canvasState;
var clear;
clear = 0;

console.log("My socket server is running");

const io = require('socket.io')(server, {cors: {origin: "*"}});

io.sockets.on('connection', newConnection);
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "SERVER:"
  });

readline.prompt();

readline.on('line', (line) => {
	if(line == "clear") {
		console.log("Clearing canvas's");
		clear = 1;
	}
	readline.prompt();
}).on('close', () => {
	process.exit(0);
})

function newConnection(socket) {
	if(typeof canvasState !== 'undefined') {
		socket.emit('update', canvasState);
	}
	else {
		socket.emit('update', "null");
	}
	socket.on('clear', clearCanvas);
	socket.on('mouse', mouseMsg);
	socket.on('update', saveCanvas);
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
	}
	function clearCanvas(data) {
		if(data == "clear!"){
			clear = 1;
		}
		if(clear !== 1){
			socket.emit('clear', clear);
		}
		else{
			io.emit('clear', clear);
		}
		clear = 0;
	}
	function saveCanvas(data) {
		canvasState = data;
	}
}