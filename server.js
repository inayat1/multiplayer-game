const express = require("express");
const socket = require("socket.io");
const uuid = require("node-uuid");

var app = express();

app.use(express.static('./public')) // serve static assets

var server = app.listen(8000, function() { // listen to the port
	console.log('Game started!!!!');
});

//Socket setup
var io = socket(server); // socket.io to work on this server

var screens =[];
var uuidArr =[];

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
	});

	socket.on('connect controller', function(callback) {
		var registered = false;
		for(var i=0; i<uuidArr.length; i++) {
			if(screens[uuidArr[i]].length <2) {
				screens[uuidArr[i]].controllers.push(socket);
				screens[uuidArr[i]].length++;
				registered = true;
				screens[uuidArr[i]].screenSocket.emit('register controller', {contSocketID : socket.id});
				break;
			}
		}
		if(!registered) {
			callback({register:false})
		}

	});

	socket.on('move', function(data) {  //listen to that event
		io.sockets.emit('move', data, socket.id); // all the different sockets connected
	}) 
}); 