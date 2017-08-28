// Make connection

var socket = io.connect('http://localhost:8000'),
	left = document.querySelector('.left'),
	right = document.querySelector('.right'),
	servers = document.querySelector('.servers'),
	emitData,
	moveLeft =0,
	moveRight=0;

socket.on('choose server', function(screenUuidArr) {
	var serverList ='';
	for(var i =0; i<screenUuidArr.length; i++) {
		serverList+="<li data-uuid="+ screenUuidArr[i] +" >Server"+ (i+1) +"</li>";
	}
	servers.innerHTML = serverList;
});

// emit events
left.addEventListener('click', function() {
	emitData('left');
});

servers.addEventListener('click', function(event) {
	var serverUuid = event.target.getAttribute('data-uuid');
	socket.emit('connect controller', serverUuid, function(data) {
		if(!data.register) {
			alert('limit full');
		}
	});
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