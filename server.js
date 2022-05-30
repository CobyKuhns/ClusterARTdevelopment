//express makes setting up your web server faster!
var express = require('express');
const { rawListeners } = require('process');

var app = express();
//This part links the public folder to the server, so ideally index.html will get pulled when someone connects
app.use(express.static('public'));
var server = app.listen(3000);
var canvasState;
var totalVotes;
totalVotes = 0;
var votesFor;
votesFor = 0;
var MOTG;
MOTG = "Hello, and welcome to ClusterART! This is a community chalkboard I made to work on my socket programming skills. Have fun, and keep it PG :)"

console.log("My socket server is running");

const io = require('socket.io')(server, {cors: {origin: "*"}});

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	var i = 0;
	if(i == 0) {
		socket.emit("MOTG", MOTG);
		i = i + 1;
	}
	
	if(typeof canvasState !== 'undefined') {
		socket.emit('update', canvasState);
	}
	else {
		socket.emit('update', "null");
	}
	socket.on('clear', clearCanvas);
	socket.on('mouse', mouseMsg);
	socket.on('update', saveCanvas);
	socket.on('vote', countVote)
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
	}
	function clearCanvas() {
			io.emit("vote", "clear");
			console.log("Connections" + io.engine.clientsCount);
		while(totalVotes <= io.engine.clientsCount) {
			if(votesFor >= (io.engine.clientsCount / 2)) {
				io.emit("clear", 1);
				totalVotes = 0;
				votesFor = 0;
				break;			
			}
		}
	}
	
	function saveCanvas(data) {
		canvasState = data;
	}
	function countVote(data) {
		if(data) {
			votesFor = votesFor + 1;
			console.log(votesFor);
		}
	}
}