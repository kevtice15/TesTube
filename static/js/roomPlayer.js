// var playlistIds = [];
var player;
var room;
var state;
var currentVideoId = null;
var currentVideoIndex;
var currentTime;
var playlist = [];


function createPlaylist(pname, pshared){
	$.ajax({
		type: 'post',
		data:{name: pname, shared: pshared},
		url: '/playlists',
		success: function(data){
			console.log("Playlist created");
		}
	});
}

function getMyPlaylists(){
	$.ajax({
		type: 'get',
		url:'/user/playlists',
		success: function(data, err){
			console.log(data);
			if(err){
				console.log(err);
			}
		}
	});
}

function addVideoToPlaylist(playlist_id, vid_id, vid_name){
	$.ajax({
		type: 'post',
		data: {'body':{'video_id': vid_id, 'video_name': vid_name}},
		url: '/playlists/new/video/' + playlist_id,
		success: function(data){
			console.log(data);
		}
	});
}

function addPlaylistToUser(name, shared){
	$.ajax({
		type: 'post',
		data: {'body':{'name': name, 'shared': shared}},
		url: '/user/new/playlist',
		success: function(data){
			console.log(data);
		}
	});
}

$(document).ready(function(){



	var width = $(window).width();
	var height = $(window).height();
	console.log(width);
	console.log(height);
	var test;

	function createVideo(id){
		$('#ytplayer').attr('class', 'video-frame');
/*
		$('#ytplayer').attr('width', width);
		$('#ytplayer').attr('height', 200);
*/
		$('#ytplayer').attr('src','http://www.youtube.com/embed/' + id + '?controls=0&showinfo=0&enablejsapi=1&iv_load_policy=3&rel=0&modestbranding=1&amp');
		$('#ytplayer').attr('frameborder', '0');
	}


	$('#searchContainer').css({zIndex: 100});	
	var leftValue = 0;
	var topValue = 0;
	
/*
	$('#login-button').click(function() {
		leftValue -= (width - 0);
		$('#canvasDiv').css({top: - 0, left: leftValue, position: 'absolute'});
	});	
*/

	//Code for the div to add a room
	//==========================================================
	$('#addRoomButton').click(function(){
		var tempTop =  0.2*height;
		$('#createRoom').css({top: tempTop});
	});

	$('#createRoomButton').click(function(){
		if($('#roomName').val()!== ""){
			var tempRoom = $('#roomName').val();
			clientCreateRoom(tempRoom);
			leftValue -= (width - 0);
			$('#canvasDiv').css({top: 0, left: leftValue, position: 'absolute'});
			$('#createRoom').css({top: -300});
			$('#'+ $('#roomName').val()).addClass('depressed');
			$('#roomName').val("");
		}else {
			$('#errorRoom').html('Please enter a different room name');
		}
	});

	//Add the code for the cancel out of the menu

	//==========================================================


	$('.roomLI').click(function() {
		leftValue -= (width - 0);
/*   		leftValue -= Math.floor(width) */
  		console.log(leftValue);
	  	$('#canvasDiv').css({top: 0, left: leftValue, position: 'absolute'});
	  	
	  	$(this).addClass('depressed');
  	});
  	
  	$('#backButton').click(function() {
  		leftValue += (width - 0);
  		console.log(leftValue);
	  	$('#canvasDiv').css({top: - 0, left: leftValue, position: 'absolute'});	  	
  	});
  	 	
 	 	
  	//search menu
  	$('#searchVideo').click(function() {
		leftValue -= (width - 0);
		$('#canvasDiv').css({top: 0, left: leftValue, position: 'absolute'}); 	
		console.log("done");
	});    	 	
		
	$('#searchDone').click(function() {
		leftValue += (width - 0);
		$('#canvasDiv').css({top: 0, left: leftValue, position: 'absolute'}); 	
		console.log("done");
		});  	 	
		
	
	
	
	
	
	$('#searchMenuButton').click(function() {
		topValue -= height;
		$('#canvasDiv').css({top: topValue, left: leftValue, position: 'absolute'});
		$('#playlist-wrapper').css({zIndex: 0});
		$('#searchContainer').css({zIndex: 100});
	});

	$('#search-button').click(function() {
		search($('#query').val());
	});
	

  
  
	
	$('#playListMenuButton').click(function(){
		topValue -= height;
		$('#canvasDiv').css({top: topValue, left: leftValue, position: 'absolute'});
		$('#searchContainer').css({zIndex: 0});
		$('#playlist-wrapper').css({zIndex: 100});
	});
	
	
	var playerHeightRatio = 0.5;
	var menuPercentage = .10;	
	var playerTop  = (playerHeightRatio * height) + (menuPercentage * height) ; 
	var down = false;
	
	$('#playerButton').click(function(){
	console.log(playerTop);
		if(down === false) {
			$('#playListDiv').css({bottom: - playerTop, left: 0, position: 'absolute', img: 'img/plus.png'});
			$('#player').attr('src','img/playerGlow.png');
				down =true;
		} else {
			$('#playListDiv').css({bottom: 0, left: 0, position: 'absolute'});
			$('#player').attr('src','img/player.png');

			down =false;
		}
	})
	
	$('#searchResults').on('click', '.video-result-wrapper', function(){
		 // console.log(this);
		 // console.log($(this));
		 // console.log($(this).find('.add'));
		 // console.log($(this).find('.add img'));

		//Moved the code to call addVideo (adding a video to the socket playlist) out of the
		//search.js file because the click function wasn't getting bound to the .video-result-wrapper
		//since the dom objects didnt exist yet.  This is actually better because
		//then we can have a different addVideo script in the player.js for a single person

		$(this).find('.add img').attr('src', 'img/check.png');
		var videoData = $(this).data();
		addVideo(videoData);

	});
	

	//Will want to put a add videos thing to the empty video or a create group thing
	createVideo(playlist[0]);
	
	// Add the API 
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	// Register the player
	// var player;
	console.log(player);
	onYouTubeIframeAPIReady = function() {
		player = new YT.Player('ytplayer', {
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	};
	

	
	/*********************************
			Room player controls
	**********************************/

	//play video
	$('#play').click(function() {
		// playPauseToggle(parseState(1));
		playPauseToggle(parseState(1), player.getCurrentTime());
	});
	//pause video
	$('#pause').click(function() {
		// playPauseToggle(parseState(2));
		playPauseToggle(parseState(2), player.getCurrentTime());
	});
	
	//play next video
	$('#next').click(function() {

		if(playlist[currentVideoIndex+1]){
			currentVideoIndex++;
			updateVideo(currentVideoIndex);
		}
	
	});

	//play previous video
	$('#previous').click(function() {

		if(playlist[currentVideoIndex-1]){
			currentVideoIndex--;
			updateVideo(currentVideoIndex);
		}
	
	});

	//stop video and clear
	$('#stop').click(function() {
		// player.stopVideo();
		// player.clearVideo();
		stopVideo();
	});
	//mute audio
	var mute = false;
	$('#mute').click(function() {
		if (mute === false) {
			player.mute();
			mute = true;
		} else {
			player.unMute();
			mute = false;
		}
	});
	
	//when the player finishes loading
	function onPlayerReady(event) {
		//e.g. event.target.playVideo();
		//call functions to update the data
		setInterval(function(){
			//video time
			updateDom('#time', player.getCurrentTime());
			currentTime = player.getCurrentTime();
			//percentage of video loaded
			updateDom('#loaded', Math.round(player.getVideoLoadedFraction() * 100) / 100);
			//state of the player
			updateDom('#state', parseState(player.getPlayerState()));
			//length of the video
			updateDom('#duration', player.getDuration());
			//url of the video
			updateDom('#url', player.getVideoUrl());
			//return volume
			updateDom('#volume', player.getVolume());
			//return muted
			updateDom('#muteS', player.isMuted());
			//return quality
			updateDom('#quality', player.getPlaybackQuality());
		}, 10);
	}
	
/*
	The API calls this function when the player's state changes.

*/
	var done = false;
	
	function onPlayerStateChange(e) {
		// //socket emit the event
		// videoEvent({

		// 	state: parseState(e.data),

		state = e.data;

		// console.log(parseState(state));

		$('#currentState').html(parseState(e.data));

		// });
		// if (e.data === 1 || e.data === 2){
		// 	playPauseToggle(parseState(e.data));
		// }

		// if (e.data === 1 || e.data === 2){
		// 	playPauseToggle(parseState(e.data), currentTime);
		// }

		// console.log('event: ' + e.data);
		// console.log(parseState(e.data));
	}

	//update the DOM
	function updateDom(elemId, data) {
		$(elemId).html(' ' + data + '<br>');
		//console.log(data);
	}
	
	//return a string based on its corrisponding code
	function parseState(state) {
		if (state === -1) {
			return 'unstarted';
		} else if (state === 0) {
			return 'ended';
		} else if (state === 1) {
			return 'playing';
		} else if (state === 2) {
			return 'paused';
		} else if (state === 3) {
			return 'buffering';
		} else if (state === 5) {
			return 'video cued';
		}		
	}




	
});
	
function sessionTest(){
		$.ajax({
			type: 'get',
			url: '/test',
			success:function(data){
				console.log(data);
			}
		});
	}











