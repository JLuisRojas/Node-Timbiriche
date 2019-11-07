var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");
var timbiriche = new Timbiriche(800, 600, 100);
var player = "J";
var gameStarted = false;
var turn = false;

// Us this to connect to custom server
//var socket = io.connect("172.20.10.4:8080");
var socket = io();

canvas.onmousedown = function(e) {
	if(gameStarted && turn) {
		socket.emit("player_move", {x:e.x, y:e.y, player:player})
	}
}

canvas.onmousemove = function (e) {
	if(gameStarted && turn) {
		timbiriche.previewLine(ctx, e.clientX, e.clientY);
	}
}

socket.on("click", function(data) {
	var v = timbiriche.signal(data.x, data.y, data.player);

	if(v == 0) {
		turn = !turn;
	}
});

socket.on("assing_player", function(data) {
	player = data.player;
	turn = data.turn;

	ctx.font = "30px Arial";
	ctx.fillText("Waiting for the other player", 100, 100);
});

socket.on("start", function(data) {
	gameStarted = true;
	ctx.clearRect(0, 0, 800, 600);
	timbiriche.draw(ctx);
});
