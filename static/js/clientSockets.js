var socket;

function clientJoinRoom(r, room_id){
	socket = io.connect(null,{'force new connection': true});
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
		console.log('client connected join');
		console.log("Preparing to emit", r, room_id);
		socket.emit('joinRoom', {room_name: r, room_id: room_id});
		console.log("Join room emitted");
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

		var source1 = document.getElementById("playlistTemplate").innerHTML;
		var template1 = Handlebars.compile(source1);
		console.log(data.body);
		//placeholder is the parent div
		console.log("Added video to playlist", data);
/* 		document.getElementById("playlist").innerHTML = template1(data.body); */
		$('#playlist').append(template1(data.body));

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

	socket.on('populateRoom', function(upPlaylist, isDJ){
		// TODO: display playlist and attach the id of the playlist and
		// the videos in the HTML
		var playlistDiv = $('#playlist');
		playlistDiv.attr('data-id', playlist._id);
		
		for(var i = 0; i < upPlaylist.videos.length; i++){
			playlistDiv.append("<div class=\"video-results-wrapper\" data-id=\"" + upPlaylist.videos[i]._id + "\" data-title=\"" + upPlaylist.videos[i].name + "\"><div class=\"thumbnail\"><img src=\"" + upPlaylist.videos[i].thumbnail + "\"></div><div class=\"search-title\"" + upPlaylist.videos[i].name + "</div></div>");


			// var thumbDiv = $('div').addClass("thumbnail");
			// console.log("thumbDiv: ", thumbDiv);
			// var thumbImg = $('img').attr("src", playlist.videos[i].thumbnail);
			// console.log("thumbImg: ", thumbImg);
			// var vidTitleDiv = $('div').addClass("search-title").html(playlist.videos[i].name);
			// console.log("vidTitleDiv: ", vidTitleDiv);
			// var vidResultsDiv = $("div").addClass("video-results-wrapper").attr("data-dbid", playlist.videos[i]._id);
			// console.log("vidResultDiv: ", vidResultsDiv);
			//thumbDiv.append(thumbImg);
			//vidResultsDiv.append(thumbDiv);
			//vidResultsDiv.append(vidTitleDiv);
			//playlistDiv.append(vidResultsDiv);
		}



		console.log("Populating playlist: ", upPlaylist);
		playlist = upPlaylist.videos;
		if(isDJ && playlist !== undefined && playlist !== []){
			console.log("The DJ ENTERS", isDJ);
			player.cueVideoById(playlist[0].youtube_id, 0, 'medium');
			console.log("Player loaded video");
		}
		console.log("Now playlist = ", playlist);

	});

}

function clientLeaveRoom(){
	$("#playlist").empty();
	socket.disconnect();
	socket = null;
	console.log("client disconnected");
}

function clientCreateRoom(r){
	//REDUNDANT CODE EXCEPT FOR A FEW THINGS......WILL WANT TO CREATE A ????

	socket = io.connect(null,{'force new connection': true});
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

	socket.on("write-room-id", function(data){
		$('#rooms').prepend('<li class="roomLI" onclick="clientJoinRoom(\''+ r + '\', ' + '\'' + data.room_id + '\')" data-id="' + data.room_id + '"><a href="#" >' + r + '</a></li>');
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
		console.log("NEW VIDEO EVENT")
		var source1 = document.getElementById("playlistTemplate").innerHTML;
		var template1 = Handlebars.compile(source1);
		console.log(data.body);
		//placeholder is the parent div
/* 		document.getElementById("playlist").innerHTML = template1(data.body); */
		$('#playlist').append(template1(data.body));

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

// function addVideo(id){
function addVideo(videoData){
	// socket.emit('videoAdded', {body: id });
	console.log("client add video to playlist:", videoData);
	socket.emit('videoAdded', {body: videoData});
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


// function disconnectFromRoom(){
// 	$("#playlist").empty();
// 	socket.emit('disconnect');
// }










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

