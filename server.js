var express = require('express'), 
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

var waitingPlayer = 1;
var player = "";
var turn = false;

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);

app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");

io.on("connection", function(socket) {
	if(waitingPlayer == 1) {
		player = "A";
		turn = true;
	} else {
		player = "B";
		turn = false;
	}

	waitingPlayer ++;

	socket.emit("assing_player", {player:player, turn:turn});

	if(waitingPlayer == 3) {
		io.emit("start", null);
	}

	socket.on("player_move", function(data) {
		io.emit("click", data);
	});
});
