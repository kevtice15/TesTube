var socket;
function clientJoinRoom(r){
	socket = io.connect();
	console.log('client join room ' + r);
	var room = r;

	socket.on("status", function(data) {
		if (data.success) {
		  console.log("Message successfully sent");
		} else {
		  console.log("Message failed to send");
		}
	});

	socket.on('connect', function(){
		console.log('client connected');
			socket.emit('joinRoom', room);
	});

	// listener, whenever the server emits 'updatechat', this updates the chat body
	socket.on('updatechat', function (username, data) {
		$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
	});

	// listener, whenever the server emits 'updaterooms', this updates the available rooms
	socket.on('updaterooms', function(rooms) {
		$('#rooms').empty();
		$.each(rooms, function(key, value) {
			$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
		});
	});
	
	socket.on("newVideo", function(data) {

		var source = document.getElementById("playlistTemplate").innerHTML;
		var template = Handlebars.compile(source);
		console.log(data.body);
		//placeholder is the parent div
		document.getElementById("playlist").innerHTML = template(data.body);


	   // $("#playlist").append($("<li>").html(data.body.id));
	   playlist.push(data.body.id);
	   if(currentVideoId === null){
			player.cueVideoById(data.body.id);
			currentVideoId = data.body.id;
			currentVideoIndex = 0;
	   }
	});

	socket.on('updateVideo', function(video){
		player.loadVideoById(playlist[video], 0, 'medium');
		console.log("should be playing next song " + video);
	});

	socket.on('update', function(data){
		if(data.state === 'playing'){
			player.playVideo();
			// player.seekTo(data.time, false);
		}else if(data.state === 'paused'){
			player.seekTo(data.time, false);
			player.pauseVideo();	
		}
	});

	socket.on('stopVideo', function(){
		player.stopVideo();
		player.clearVideo();
	});
}

function clientLeaveRoom(){
	socket.disconnect();
	socket = null;
	console.log("client disconnected");
}

function clientCreateRoom(r){
	
	$('#rooms').prepend('<li class="roomLI" id="'+r+'" onclick="clientJointRoom(\''+r+'\')"><a href="#" >' + r + '</a></li>');


	//REDUNDANT CODE EXCEPT FOR A FEW THINGS......WILL WANT TO CREATE A ????

	socket = io.connect();
	console.log('client create room ' + r);
	var room = r;

	socket.on("status", function(data) {
		if (data.success) {
		  console.log("Message successfully sent");
		} else {
		  console.log("Message failed to send");
		}
	});

	socket.on('connect', function(){
		console.log('client connected');
			socket.emit('addRoom', room);
	});

	// listener, whenever the server emits 'updatechat', this updates the chat body
	socket.on('updatechat', function (username, data) {
		$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
	});

	// listener, whenever the server emits 'updaterooms', this updates the available rooms
	socket.on('updaterooms', function(rooms) {
		$('#rooms').empty();
		$.each(rooms, function(key, value) {
			$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
		});
	});
	
	socket.on("newVideo", function(data) {
	   $("#playlist").append($("<li>").html(data.body));
	   playlist.push(data.body);
	   if(currentVideoId === null){
			player.cueVideoById(data.body);
			currentVideoId = data.body;
			currentVideoIndex = 0;
	   }
	});

	socket.on('updateVideo', function(video){
		player.loadVideoById(playlist[video], 0, 'medium');
		console.log("should be playing next song " + video);
	});

	socket.on('update', function(data){
		if(data.state === 'playing'){
			player.playVideo();
			// player.seekTo(data.time, false);
		}else if(data.state === 'paused'){
			player.seekTo(data.time, false);
			player.pauseVideo();	
		}
	});

	socket.on('stopVideo', function(){
		player.stopVideo();
		player.clearVideo();
	});
}

// function addVideo(id){
function addVideo(videoData){
	// socket.emit('videoAdded', {body: id });
	socket.emit('videoAdded', {body: videoData });
}

function updateVideo(videoToPlay){
	socket.emit('updateVideo', videoToPlay);
}

function playPauseToggle(state, time){
	socket.emit('playPause', {state: state, time: time});
	console.log("client emit statechage: " +  state + " at " + time);
}

function stopVideo(){
	socket.emit('stop');
}










// function playPauseToggle(e, currentTime){
// 	socket.emit('playPause', {e: e, time: currentTime});
// 	console.log("client emit statechage: " +  e);

// }

// socket.on('update', function(e){
// 	if(e === 'playing'){
// 		if(Math.abs(currentTime-e.time)){
// 			player.playVideo();
// 		}else{
// 			player.seekTo(e.time, false);
// 		}
		
// 	}else if(e === 'paused'){
// 		player.pauseVideo();
// 	}
// });

