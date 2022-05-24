var socket;
let cnv;
var img;
var hasBg;
hasBg = 0;
var needsCleared;
needsCleared = 0;

var penColor = {
	r: 255,
	g: 255,
	b: 255,
}

function setup() {
	cnv = createCanvas(800, 800);
	background(0);
	
	socket = io.connect("http://52.52.137.68:3000");
	socket.on('mouse', newDrawing);
	socket.on("update", loadCanvas);
	socket.on('clear', clearCanvas);
}

var timerID = setInterval(function() {
    let canvasState = cnv.elt.toDataURL();
	socket.emit('update', canvasState);
}, 3 * 1000);

var timerID2 = setInterval(function() {
    socket.emit('clear', "clear?")
}, 3 * 1000);

function loadCanvas(data) {
	if(data !== "null") {
		img = loadImage(data);
		
	}
}
function newDrawing(data) {
	console.log(data);
	noStroke();
	fill(255);
	ellipse(data.x, data.y, 10, 10);
}

function mouseDragged() {
	console.log(mouseX + ',' + mouseY);
	var data = {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);
	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, 10, 10);
}

function mouseClicked() {
	console.log(mouseX + ',' + mouseY);
	var data = {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);
	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, 10, 10);
}

function touchMoved() {
	console.log(mouseX, mouseY)
	var data = {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);
	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, 10, 10);
}

function clearCanvas(data) {
	needsCleared = data;
}

function draw() {
	if(typeof img !== "undefined" && hasBg <= 10) {
		console.log("Attempting to update background...");
		background(img);
		hasBg = hasBg + 1;
	}
	if(needsCleared) {
		background(0);
		alert("Server has cleared the Canvas!");
		needsCleared = 0;
	}
}