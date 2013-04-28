var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	google_id: String,
	name: String,
	room_id: mongoose.Schema.ObjectId
}, {autoIndex: false});


/*
User.ensureIndexes(function(err){
	if(err){
		return handleError(err);
	}
});

User.on('index', function(err){
	if(err){
		console.log(err);
	}
});
*/

//Associates a user with a playlist
UserSchema.methods.addPlaylist = function(user, data, resp){
	var Playlist = mongoose.model('Playlist');
	var newPlaylist = new Playlist({creator: user, DJ: user, shared: data.body.shared, name: data.body.name});
	newPlaylist.save(function(err){
		if(err){
			console.error(err);
		}
	});
	console.log(newPlaylist);
	resp(newPlaylist);


/*
	var Plist = mongoose.model("Playlist");
	var fields = {
		creator: this._id,
		dj: this._id
	};
	console.log(this._id);
	Plist.findByIdAndUpdate(playlistId, {$set: fields}, function(err, resp){
		if(err){
			console.log(err);
		}
		else{
			console.log("Updated playlist", resp);
		}
	});
	console.log("Added creator and dj: ", user);
*/
};

UserSchema.deletePlaylist = function(user, playlist, resp){
	var Playlist = mongoose.model('Playlist');
	
	Playlist.findByIdAndRemove(playlist, function(err, Playlist){
		if(err){
			console.error(err);
		}
		else{
			console.log(Playlist);
		}
	});
	/*
	newPlaylist.save(function(err){
		if(err){
			console.error(err);
		}
	});
	console.log(newPlaylist);
	resp(newPlaylist);
	*/
};

//Returns array of all playlists associated with a user id
UserSchema.methods.getPlaylists = function(user, resp){
	var playlists = mongoose.model("Playlist");
	playlists.find({creator: user},{}, function(err, docs){
		console.log(docs);
		resp(docs);
	});
};


UserSchema.methods.isDJ = function(userId, resp){
	/*
	var findUser = mongoose.model("UserSchema");
	findUser.findOne({_id: userId}, function(err, user){
		if(err){
			console.error(err);
		}
		else{
			return 
		}
	});
*/
};

UserSchema.methods.joinRoom = function(userId, roomId, resp){
	var User = mongoose.model('User');
	User.findByIdAndUpdate(userId, {room_id: roomId}, function(err, User){
		if(err){
			console.log(err);
		}
		else{
			resp(User);
		}
	});
};

UserSchema.methods.leaveRoom = function(userId, roomId){
	var User = mongoose.model('User');
	User.findByIdAndUpdate(userId, {room_id: undefined}, function(err, User){
		if(err){
			console.log(err);
		}
		else{
			resp(User);
		}
	});
};

UserSchema.methods.becomeDJ = function(){

};

UserSchema.methods.relinquishDJ = function(){

};

module.exports = mongoose.model("UserSchema", UserSchema);