const express = require("express");
const socket = require("socket.io");
const uuid = require("node-uuid");

var app = express(),
	server,
	io,
	screens=[],
	uuidArr=[];

app.use(express.static('./public')) // serve static assets

server = app.listen(8000, function() { // listen to the port
	console.log('Game started!!!!');
});

//Socket setup
io = socket(server); // socket.io to work on this server

function screen(socket, screenID) {
	this.screenSocket = socket;
	this.screenID = screenID;
	this.controllers = [];
	this.length = 0;
}

// listen for an event
io.on('connection', function(socket) { // every client have differnt socket
	console.log('made socket connection');

	socket.on('game screen', function() {
		var screenID = uuid();
		uuidArr.push(screenID);
		screens[screenID]= new screen(socket, screenID);
		//screens.push(new screen(socket, screenID, screenNum));
		io.sockets.emit('choose server', uuidArr);
	});

	io.sockets.emit('choose server', uuidArr);

	socket.on('connect controller', function(serverUuid, callback) {
		//for(var i=0; i<uuidArr.length; i++) {
		if(screens[serverUuid].length <2) {
			screens[serverUuid].controllers.push(socket);
			screens[serverUuid].length++;
			screens[serverUuid].screenSocket.emit('register controller', {contSocketID : socket.id});
		} else {
			callback({register:false})
		}
		//}
		/*if(!registered) {
			callback({register:false})
		}*/

	});

	socket.on('move', function(data) {  //listen to that event
		io.sockets.emit('move', data, socket.id); // all the different sockets connected
	}) 
}); 