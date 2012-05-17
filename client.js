$(document).ready(function(){
	var clients = [];
	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = 'black';
	ctx.lineCap ="round";
	ctx.lineJoin= "round";
	ctx.lineWidth = 10;
	
	var worker = new Worker('scripts/worker.js');
	//worker.postMessage();
	var player = {
		color: 'black',
		size: '15',
		x: 0,
		y: 0,
		oldX: 0,
		oldY: 0,
		flag: true
	};
	var socket = io.connect('http://192.168.1.136:8080');

    socket.on('connect', function() {
        socket.emit('client_connected', {id: 0, color: player.color, size: player.size});
      });

	socket.on('new_client', function(send_clients){
		if ($('li').length != 0) {
			$('#clients').append('<li class="listelem">' + send_clients[send_clients.length -1].id + '</li>');
		}else {
			for (var i = 0; i<send_clients.length; i++) {
				$('#clients').append('<li class="listelem">' + send_clients[i].id + '</li>');
			}
		}
		clients = send_clients;
	});

	socket.on('client_dc', function(client_dc){
		$('li').each(function(){
			if (client_dc.id == $(this).text()){
				$(this).remove();
			}
		});
	});

	socket.on('previous_drawn', function(lines) {
		for (var i = 0; i<lines.length; i++) {
			draw(lines[i].x, lines[i].y, lines[i].oldX, lines[i].oldY, lines[i].color, lines[i].size);
		}
	});


	socket.on('draw', function(data){
		/*worker.postMessage({
			id: data.id,
			x: data.x,
			y: data.y,
			oldX: data.oldX,
			oldY: data.oldY,
			flag: false
		});
		*/
		worker.postMessage(data);
		draw(data.x, data.y, data.oldX, data.oldY, data.color, data.size);
	});

	socket.on('resetWorkspace', function(e) {
		resetWorkspace();
	});

	worker.addEventListener('message', function(e) {
		
	});

	function resetWorkspace() {
		ctx.rect(0, 0, 800, 800);
		ctx.fillStyle = 'white';
		ctx.fill();
	}

	function draw(x, y, oldX, oldY, color, size) {
	      	ctx.strokeStyle = color;
	      	ctx.lineWidth = size;
	        ctx.beginPath();
	        ctx.moveTo(oldX, oldY);
	        ctx.lineTo(x, y);
	        ctx.stroke();
	        ctx.closePath();
	} 
	
	$('#can').on('drag dragstart dragend', function(e){
		var x, y;
		x = (e.clientX - this.offsetLeft);
		y = (e.clientY - this.offsetTop);
		draw(x, y, player.oldX, player.oldY, player.color, player.size);
		socket.emit('drawClick', {
			x: x,
			y: y,
			oldX: player.oldX,
			oldY: player.oldY,
			color: player.color,
			size: player.size
		});
		player.oldX = x;
		player.oldY = y;
	});

	$('#can').on('mousedown', function(e){
		player.oldX = (e.clientX - this.offsetLeft);
		player.oldY = (e.clientY - this.offsetTop);
	});

	$('#button_black').on('click', function(e){
		player.color = 'black';
	});

	$('#button_blue').on('click', function(e){
		player.color = 'blue';
	});

	$('#button_red').on('click', function(e){
		player.color = 'red';
	});

	$('#button_yellow').on('click', function(e){
		player.color = 'yellow';
	});

	$('#button_green').on('click', function(e){
		player.color = 'green';
	});

	$('#button_white').on('click', function(e){
		player.color = 'white';
	});

	$('#button_size1').on('click', function(e){
		player.size = '3';
	});

	$('#button_size2').on('click', function(e){
		player.size = '8';
	});

	$('#button_size3').on('click', function(e){
		player.size = '15';
	});

	$('#button_size4').on('click', function(e){
		player.size = '25';
	});

	$('#button_reset').on('click', function(e){
		socket.emit('resetWorkspace', {});
		resetWorkspace();
	});
});