const express = require("express");
const socket = require("socket.io");
const uuid = require("node-uuid");

var app = express(),
	server,
	io,
	screens=[],
	uuidArr=[],
	controllers =[];

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

/*function controller(socket, player) {
	this.controllerSocket = socket;
	this.player = player;
}*/

// listen for an event
io.on('connection', function(socket) { // every client have differnt socket
	console.log('made socket connection');

	socket.on('game screen', function() {
		var screenID = uuid();
		uuidArr.push(screenID);
		screens[screenID]= new screen(socket, screenID);
		//screens.push(new screen(socket, screenID, screenNum));
		socket.nickname = screenID;
		//socket.set('nickname', screenID, function(){});
		io.sockets.emit('choose server', uuidArr);
	});

	socket.on('select player', function(player) {
		controllers[socket.id]= player;
	})

	io.sockets.emit('choose server', uuidArr);

	socket.on('connect controller', function(serverUuid, callback) {
		//for(var i=0; i<uuidArr.length; i++) {
		if(screens[serverUuid].length <2) {
			socket.myscreen = serverUuid;
			//socket.set('myscreen', serverUuid, function(){})
			screens[serverUuid].controllers.push(socket);
			screens[serverUuid].length++;
			screens[serverUuid].screenSocket.emit('register controller', {contSocketID : socket.id});
			callback({register:true})
		} else {
			callback({register:false})
		}
		//}
		/*if(!registered) {
			callback({register:false})
		}*/

	});

	socket.on('disconnect', function() {
		if (socket.nickname) {
			uuidArr.splice(uuidArr.indexOf(socket.nickname),1);
			for(var i = 0; i< screens[socket.nickname].controllers.length; i++) {
				screens[socket.nickname].controllers[i].emit('server disconnected', uuidArr);
			}
			delete screens[socket.nickname];
			//screens.splice(socket.nickname,1);
			io.sockets.emit('choose server', uuidArr);
		} else if(socket.myscreen) {
			var mycontroller = screens[socket.myscreen].controllers,
				index = controllers.indexOf(socket);
			mycontroller.splice(index,1);
			screens[socket.myscreen].length--;
		}
	})

	socket.on('move', function(data) {  //listen to that event
		io.sockets.emit('move', data, socket.id, controllers[socket.id]); // all the different sockets connected
	}) 
}); 