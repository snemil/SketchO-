var io = require('socket.io').listen(8080);
var clients = [];
var lines = [];

io.sockets.on('connection', function(socket){
	
	console.log('New client connected ' + socket);
	socket.on('client_connected', function(data){
		data.id = socket.id;
		// console.log('INNE I CLIENT CONNECTED');
		//clients.push(data);
		
		clients.push(data);
		io.sockets.emit("new_client", clients);	
		
		socket.emit('previous_drawn', lines);
	});

	socket.on('resetWorkspace', function(e){
		io.sockets.emit("resetWorkspace", {});
		lines = [];
	});

	socket.on('drawClick', function(player){
		/*for(client in clients){
			if(client.id === socket.id){
				client.x = player.x;
				client.y =  player.y;
				client.oldX = player.oldX;
				client.oldY = player.oldY;
				// client.type = player.type;
				console.log("Client: " + socket.id);
				console.log("X: " + player.x + ", Y:" + player.y);
				break;
			}
		 }*/
		 
		
		var line = {
			id: socket.id,
			color: player.color,
			size: player.size,
			x: player.x,
			y: player.y,
			oldX: player.oldX,
			oldY: player.oldY
		};
		lines.push(line);

		// socket.broadcast.emit("draw", {
		io.sockets.emit("draw", {
			// id: player.id,
			id: socket.id,
			color: player.color,
			size: player.size,
			x: player.x,
			y: player.y,
			oldX: player.oldX,
			oldY: player.oldY,
			flag: false
			// type: player.type
		});

		

	});

	socket.on('disconnect', function(){
		for(i = 0; i < clients.length; i++){
			if(clients[i].id === socket.id){
				clients.splice(i,1);
				break;
			}
		}	
		// console.log(clients.length);
		console.log("Client: " + socket.id + " disconnected");
		socket.broadcast.emit("client_dc", {id: socket.id});	
	});
});