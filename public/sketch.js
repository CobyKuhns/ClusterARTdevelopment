var socket;
var penColor = {
	r: 255,
	g: 255,
	b: 255,
}
function setup() {
	createCanvas(800, 800);
	background(0);
	
	socket = io.connect("http://54.67.74.14:3000");
	socket.on('mouse', newDrawing);
}

function newDrawing(data) {
	console.log(data);
	noStroke();
	fill(255);
	ellipse(data.x, data.y, 10, 10);
}

function mouseDragged() {
	console.log(mouseX + ',' + mouseY)
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
	console.log(mouseX + ',' + mouseY)
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
function draw() {
}