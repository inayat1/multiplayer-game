// Make connection

var socket = io.connect('http://localhost:8000'),
	left = document.querySelector('.left'),
	right = document.querySelector('.right'),
	player1 = document.querySelector('.player1'),
	player2 = document.querySelector('.player2'),
	servers = document.querySelector('.servers'),
	serverSection = document.querySelector('.server-section'),
	selectPayer = document.querySelector('.select-payer'),
	controller = document.querySelector('.controller'),
	emitData,
	moveLeft =0,
	moveRight=0,
	refreshServerList;

socket.on('choose server', function(screenUuidArr) {
	refreshServerList(screenUuidArr);
});

socket.on('server disconnected', function(screenUuidArr) {
	serverSection.classList.remove("hidden");
	selectPayer.classList.add("hidden");
	controller.classList.add("hidden");
	refreshServerList(screenUuidArr);
})

// emit events
left.addEventListener('click', function() {
	emitData('left');
});

player1.addEventListener('click', function() {
	selectPlayer(1);
});

player2.addEventListener('click', function() {
	selectPlayer(2);
});

refreshServerList = function(screenUuidArr) {
	var serverList ='';
	for(var i =0; i<screenUuidArr.length; i++) {
		serverList+="<li data-uuid="+ screenUuidArr[i] +" >Server"+ (i+1) +"</li>";
	}
	if(screenUuidArr.length === 0) {
		serverList = "<li>No server found</li>"
	}
	servers.innerHTML = serverList;
}

selectPlayer = function(player) {
	socket.emit('select player', player);
	selectPayer.classList.add("hidden");
	controller.classList.remove("hidden");
}

servers.addEventListener('click', function(event) {
	var serverUuid = event.target.getAttribute('data-uuid');
	socket.emit('connect controller', serverUuid, function(data) {
		if(!data.register) {
			alert('limit full');
		} else {
			serverSection.classList.add("hidden");
			selectPayer.classList.remove("hidden");
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