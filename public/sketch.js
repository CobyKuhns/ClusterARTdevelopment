var socket;
let cnv;
var img;
var hasBg;
hasBg = 0;
var needsCleared;
needsCleared = 0;

var htmlColor;
var penSize;

function setup() {
	cnv = createCanvas(1600, 750);
	cnv.parent("cnvDiv");
	background(0);
	
	socket = io.connect("http://52.52.137.68");
	socket.on('mouse', newDrawing);
	socket.on("update", loadCanvas);
	socket.on('clear', clearCanvas);
	socket.on('MOTG', displayMOTG)
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
	ellipse(data.x, data.y, data.size, data.size);
}

function mouseDragged() {
	htmlColor = document.getElementById('colorpicker').value;
	penSize = document.getElementById('size').value;
	console.log(htmlColor);
	console.log(mouseX + ',' + mouseY);
	var data = {
		x: mouseX,
		y: mouseY,
		red: parseInt(htmlColor[1]+htmlColor[2],16),
		green: parseInt(htmlColor[3]+htmlColor[4],16),
		blue: parseInt(htmlColor[5]+htmlColor[6],16),
		size: penSize
	}
	socket.emit('mouse', data);
	noStroke();
	fill(data.red, data.green, data.blue);
	ellipse(mouseX, mouseY, penSize, penSize);
}

function mouseClicked() {
	htmlColor = document.getElementById('colorpicker').value;
	penSize = document.getElementById('size').value;
	console.log(htmlColor);
	console.log(mouseX + ',' + mouseY);
	var data = {
		x: mouseX,
		y: mouseY,
		red: parseInt(htmlColor[1]+htmlColor[2],16),
		green: parseInt(htmlColor[3]+htmlColor[4],16),
		blue: parseInt(htmlColor[5]+htmlColor[6],16),
		size: penSize
	}
	socket.emit('mouse', data);
	noStroke();
	fill(data.red, data.green, data.blue);
	ellipse(mouseX, mouseY, penSize, penSize);
}

function touchMoved() {
	htmlColor = document.getElementById('colorpicker').value;
	penSize = document.getElementById('size').value;
	console.log(htmlColor);
	console.log(mouseX, mouseY)
	var data = {
		x: mouseX,
		y: mouseY,
		red: parseInt(htmlColor[1]+htmlColor[2],16),
		green: parseInt(htmlColor[3]+htmlColor[4],16),
		blue: parseInt(htmlColor[5]+htmlColor[6],16),
		size: penSize
	}
	socket.emit('mouse', data);
	noStroke();
	fill(data.red, data.green, data.blue);
	ellipse(mouseX, mouseY, penSize, penSize);
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

function displayMOTG(data) {
	alert(data);
	socket.off("MOTG")
}