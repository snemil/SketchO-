

self.addEventListener('message', function(e) {
	if (!total && total != 0) {
		var total = 0;
		var clients = [];
	}

	var dist = 0;
	dist = Math.sqrt((Math.abs(e.data.oldX - e.data.x) * Math.abs(e.data.oldX - e.data.x)) + (Math.abs(e.data.oldY - e.data.y) * Math.abs(e.data.oldY - e.data.y)));
	if (e.data.flag) {
		// lägg till ny klient
		var newClient = {
			id: e.data.id,
			dist: dist
		}

		clients.push(newClient);

		e.data.flag = false;
	}
	else {
		for(client in clients){
			if(client.id === e.data.id) {
				client.dist += dist;
				break;
			}
		}
	}
	for (client in clients) {
		total += client.dist;
	}

	self.postMessage(total);
}, false);