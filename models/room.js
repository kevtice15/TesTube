var mongoose = require('mongoose');

var Room = new mongoose.Schema({
	name: String,
	DJ: mongoose.Schema.ObjectId,
	playlist: mongoose.Schema.ObjectId,
	state:{
		currentVideoTime: Number,
		currentVideoId: String,
		currentVideoPlaylistIndex: Number,
		currentVideoState: String
	}
});

Room.methods.getDJ = function(roomId, callback){
	var Room = mongoose.model('Room');
	Room.findById(roomId, function(err, room){
		if(err){
			console.log(err);
		}
		else{
			callback(room.DJ);
		}
	});
};

Room.statics.getPlaylist = function(roomId, callback){
	var Room = mongoose.model('Room');
	Room.findById(roomId, function(err, room){
		if(err){
			console.log(err);
		}
		else{
			console.log("found room: ", room);
			console.log("found playlist: ", room.playlist);
			var Playlist = mongoose.model("Playlist");
			Playlist.findById(room.playlist, function(err, playlist){
				if(err){
					console.log(err);
				}
				else{
					callback(playlist);
				}
			});
		}
	});
};

Room.methods.getState = function(roomId, callback){
	var Room = mongoose.model('Room');
	Room.findById(roomId, function(err, room){
		if(err){
			console.log(err);
		}
		else{
			callback(room.state);
		}
	});
};

Room.methods.changeState = function(roomId, newState){
	var Room = mongoose.model('Room');
	Room.findByIdAndUpdate(roomId, {state: newState}, function(err, room){
		if(err){
			console.log(err);
		}
		else{
			room.save(function(err){
				if(err){
					console.error(err);
				}
			});
			callback(room);
		}
	});
};

Room.methods.changeDJ = function(roomId, dj_id, callback){
	var Room = mongoose.model('Room');
	Room.findByIdAndUpdate(roomId, {DJ: dj_id}, function(err, room){
		if(err){
			console.log(err);
		}
		else{
			room.save(function(err){
				if(err){
					console.error(err);
				}
			});
			callback(Room);
		}
	});
};



Room.methods.addPlaylist = function(roomId, playlistId, callback){
	var Room = mongoose.model('Room');
	console.log("Looking for room: ", roomId);
	Room.findByIdAndUpdate(roomId, {playlist: playlistId}, function(err, room){
		if(err){
			console.log(err);
		}
		else{
			room.save(function(err){
				console.error(err);
			});
			callback(room);
		}
	});
};

module.exports = mongoose.model("Room", Room);
