var socket;
let cnv;
var img;
var hasBg;
hasBg = 0;
var needsCleared;
needsCleared = 0;

var htmlColor;
var penColor = {
	r: 255,
	g: 255,
	b: 255,
}



	



function setup() {
	cnv = createCanvas(800, 800);
	background(0);
	
	socket = io.connect("http://52.52.137.68");
	socket.on('mouse', newDrawing);
	socket.on("update", loadCanvas);
	socket.on('clear', clearCanvas);
	const element = document.getElementById('clear');
	element.addEventListener("click", () => {
		socket.emit('clear', 1);
		console.log("Sent clear message!");
	});
}

var timerID = setInterval(function() {
    let canvasState = cnv.elt.toDataURL();
	socket.emit('update', canvasState);
}, 3 * 1000);

var timerID2 = setInterval(function() {
    socket.emit('clear', 0)
}, 3 * 1000);

function loadCanvas(data) {
	if(data !== "null") {
		img = loadImage(data);
		
	}
}
function newDrawing(data) {
	console.log(data);
	noStroke();
	fill(data.red, data.green, data.blue);
	ellipse(data.x, data.y, 10, 10);
}

function mouseDragged() {
	htmlColor = document.getElementById('colorpicker').value;
	console.log(htmlColor);
	console.log(mouseX + ',' + mouseY);
	var data = {
		x: mouseX,
		y: mouseY,
		red: parseInt(htmlColor[1]+htmlColor[2],16),
		green: parseInt(htmlColor[3]+htmlColor[4],16),
		blue: parseInt(htmlColor[5]+htmlColor[6],16),
	}
	socket.emit('mouse', data);
	noStroke();
	fill(data.red, data.green, data.blue);
	ellipse(mouseX, mouseY, 10, 10);
}

function mouseClicked() {
	htmlColor = document.getElementById('colorpicker').value;
	console.log(htmlColor);
	console.log(mouseX + ',' + mouseY);
	var data = {
		x: mouseX,
		y: mouseY,
		red: parseInt(htmlColor[1]+htmlColor[2],16),
		green: parseInt(htmlColor[3]+htmlColor[4],16),
		blue: parseInt(htmlColor[5]+htmlColor[6],16),
	}
	socket.emit('mouse', data);
	noStroke();
	fill(data.red, data.green, data.blue);
	ellipse(mouseX, mouseY, 10, 10);
}

function touchMoved() {
	htmlColor = document.getElementById('colorpicker').value;
	console.log(htmlColor);
	console.log(mouseX, mouseY)
	var data = {
		x: mouseX,
		y: mouseY,
		red: parseInt(htmlColor[1]+htmlColor[2],16),
		green: parseInt(htmlColor[3]+htmlColor[4],16),
		blue: parseInt(htmlColor[5]+htmlColor[6],16),
	}
	socket.emit('mouse', data);
	noStroke();
	fill(data.red, data.green, data.blue);
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