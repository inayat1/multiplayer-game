// Make connection

var socket = io.connect('http://localhost:8000'),
	ball1 = document.querySelector('.ball1'),
	ball2 = document.querySelector('.ball2'),
	emitData,
	moveLeft =0,
	moveRight=0,
	contJoined = [];

socket.emit('game screen');

// emit events

// listen for events
// 
socket.on('move', function(data, id, player) {
	var noMatch = false;
	for(var i =0; i<contJoined.length;i++) {
		if(id === contJoined[i]) {
			noMatch = true;
		}
	}
	if(!noMatch) {
		return false;
	}
	console.log(id);
	if(data.dir == "left") {
		moveLeft += data.coord;
	} else {
		moveLeft -= data.coord;
	}
	if(player ===1) {
		ball1.style.marginLeft = moveLeft+"px";
	} else {
		ball2.style.marginLeft = moveLeft+"px";
	}
	
});

socket.on('register controller', function(data) {
	console.log(data.contSocketID);
	contJoined.push(data.contSocketID);
});