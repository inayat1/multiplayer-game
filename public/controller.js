// Make connection

var socket = io.connect('http://localhost:8000'),
	left = document.querySelector('.left'),
	right = document.querySelector('.right'),
	emitData,
	moveLeft =0,
	moveRight=0;

socket.emit('connect controller', function(data) {
	if(!data.register) {
		console.log('limit full');
	}
});

// emit events
left.addEventListener('click', function() {
	emitData('left');
});

right.addEventListener('click', function() {
	emitData('right');
});

emitData = function(directn) {
	socket.emit('move',{
		dir: directn,
		coord: 2
	});
}

// listen for events
// 
/*socket.on('move', function(data) {
	if(data.dir == "left") {
		moveLeft += data.coord;
	} else {
		moveLeft -= data.coord;
	}
	ball.style.marginLeft = moveLeft+"px";
});*/