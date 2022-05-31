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
var votesAgainst = 0;
var MOTG;

MOTG = "Hello, and welcome to ClusterART! This is a community chalkboard I made to work on my socket programming skills. Have fun, and keep it PG :)"

console.log("My socket server is running");

const io = require('socket.io')(server, {cors: {origin: "*"}});

io.sockets.on('connection', newConnection);

var timerID = setInterval(function() {
    if(votesFor > (io.engine.clientsCount / 2)) {
		io.emit('result', 1);
		io.emit("clear", 1);
		totalVotes = 0;
		votesFor = 0;
		votesAgainst = 0;
	}
	else if(votesAgainst >= (io.engine.clientsCount / 2)) {
		io.emit("result", 0);
		totalVotes = 0;
		votesFor = 0;
		votesAgainst = 0;
	}
}, 2 * 1000);

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
	socket.on('vote', countVote);
	
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
	}

	function clearCanvas() {
		votesFor = votesFor + 1;
		socket.broadcast.emit("vote", "clear");
	}
	
	function saveCanvas(data) {
		canvasState = data;
	}
	function countVote(data) {
		if(data) {
			votesFor = votesFor + 1;
			console.log(votesFor);
		}
		else {
			votesAgainst = votesAgainst + 1;
		}
	}
}