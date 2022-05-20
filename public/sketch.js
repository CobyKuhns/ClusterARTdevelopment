var socket;

function setup() {
	createCanvas(400, 400);
	background(51);
	
	socket = io.connect("http://localhost:3000");
}

function draw() {
	background(51);
	ellipse(mouseX, mouseY, 10, 10);
}