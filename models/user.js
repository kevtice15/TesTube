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
UserSchema.methods.addPlaylist = function(user, data, callback){
	var Playlist = mongoose.model('Playlist');
	var newPlaylist = new Playlist({creator: user, DJ: user, shared: data.body.shared, name: data.body.name});
	newPlaylist.save(function(err){
		if(err){
			console.error(err);
		}
	});
	console.log(newPlaylist);
	callback(newPlaylist);


/*
	var Plist = mongoose.model("Playlist");
	var fields = {
		creator: this._id,
		dj: this._id
	};
	console.log(this._id);
	Plist.findByIdAndUpdate(playlistId, {$set: fields}, function(err, callback){
		if(err){
			console.log(err);
		}
		else{
			console.log("Updated playlist", callback);
		}
	});
	console.log("Added creator and dj: ", user);
*/
};

UserSchema.deletePlaylist = function(user, playlist, callback){
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
	callback(newPlaylist);
	*/
};

//Returns array of all playlists associated with a user id
UserSchema.statics.getPlaylists = function(user, callback){
	var playlists = mongoose.model("Playlist");
	playlists.find({creator: user},{}, function(err, docs){
		console.log(docs);
		callback(docs);
	});
};


UserSchema.methods.isDJ = function(userId, callback){
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

UserSchema.statics.joinRoom = function(userId, roomId, callback){
	this.findByIdAndUpdate(userId, {room_id: roomId}, function(err, user){
		if(err){
			console.log(err);
		}
		else{
			user.save(function(err){
				if(err){
					console.error(err);
				}
			});
			callback(user);
		}
	});


};

UserSchema.statics.leaveRoom = function(userId, roomId){
	var User = mongoose.model('User');
	User.findByIdAndUpdate(userId, {room_id: undefined}, function(err, User){
		if(err){
			console.log(err);
		}
		else{
			callback(User);
		}
	});
};

UserSchema.methods.becomeDJ = function(){

};

UserSchema.methods.relinquishDJ = function(){

};

module.exports = mongoose.model("UserSchema", UserSchema);